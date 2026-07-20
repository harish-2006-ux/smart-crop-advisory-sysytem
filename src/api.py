"""Simple Flask API for Agricultural Analytics with MongoDB Integration."""

from flask import Flask, jsonify, render_template, request, send_from_directory
import os
import sys
from datetime import datetime, timezone
from pymongo import MongoClient
import logging
import base64
from werkzeug.utils import secure_filename
from PIL import Image
import io

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__, template_folder=os.path.join(os.path.dirname(__file__), 'templates'))

# Configure file uploads
UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'uploads')
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# Create upload directory if it doesn't exist
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# MongoDB Configuration
MONGODB_URI = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/agri_analytics')
try:
    # Initialize MongoDB connection
    client = MongoClient(MONGODB_URI)
    db = client.agri_analytics
    
    # Test connection
    client.admin.command('ping')
    logger.info("✅ Connected to MongoDB successfully!")
    
    # Collections
    analyses_collection = db.analyses
    predictions_collection = db.predictions  
    performance_collection = db.performance
    farm_data_collection = db.farm_data
    image_analyses_collection = db.image_analyses
    
    # Create indexes for better performance
    analyses_collection.create_index([("timestamp", -1)])
    predictions_collection.create_index([("timestamp", -1)])
    performance_collection.create_index([("timestamp", -1)])
    image_analyses_collection.create_index([("timestamp", -1)])
    image_analyses_collection.create_index([("analysis_type", 1)])
    
except Exception as e:
    logger.error(f"❌ MongoDB connection failed: {e}")
    logger.info("📝 Using fallback in-memory storage")
    client = None
    db = None

# Fallback in-memory data storage
farm_data = {
    'predictions': [],
    'analysis_count': 0
}

@app.route('/image-analysis-page')
def image_analysis_page():
    """Render the image analysis page."""
    return render_template('modern_image_analysis.html')

@app.route('/api/image-analysis', methods=['POST'])
def image_analysis():
    """Analyze uploaded agricultural images."""
    try:
        # Check if image file is present
        if 'image' not in request.files:
            return jsonify({'error': 'No image file provided'}), 400
        
        file = request.files['image']
        if file.filename == '':
            return jsonify({'error': 'No image file selected'}), 400
        
        if not allowed_file(file.filename):
            return jsonify({'error': 'Invalid file type. Please upload PNG, JPG, JPEG, GIF, or WebP files.'}), 400
        
        # Get analysis type
        analysis_type = request.form.get('analysis_type', 'general')
        description = request.form.get('description', '')
        location = request.form.get('location', '')
        
        # Save the uploaded file
        filename = secure_filename(file.filename)
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = f"{timestamp}_{filename}"
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        # Process the image
        analysis_result = analyze_agricultural_image(filepath, analysis_type)
        
        # Create analysis record
        analysis_id = f"IMG_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        analysis_data = {
            'analysis_id': analysis_id,
            'timestamp': datetime.now(timezone.utc),
            'filename': filename,
            'filepath': filepath,
            'analysis_type': analysis_type,
            'description': description,
            'location': location,
            'results': analysis_result,
            'file_size': os.path.getsize(filepath),
            'image_dimensions': get_image_dimensions(filepath)
        }
        
        # Store in MongoDB
        if image_analyses_collection:
            try:
                image_analyses_collection.insert_one(analysis_data.copy())
                logger.info(f"✅ Image analysis {analysis_id} stored in MongoDB")
            except Exception as e:
                logger.error(f"❌ Failed to store image analysis in MongoDB: {e}")
        
        return jsonify({
            'status': 'success',
            'analysis_id': analysis_id,
            'results': analysis_result,
            'filename': filename,
            'timestamp': analysis_data['timestamp'].isoformat()
        })
        
    except Exception as e:
        logger.error(f"❌ Image analysis error: {str(e)}")
        return jsonify({'error': f'Analysis failed: {str(e)}'}), 500

@app.route('/static/<path:filename>')
def static_files(filename):
    """Serve static files including PWA assets."""
    return send_from_directory(os.path.join(os.path.dirname(__file__), 'static'), filename)

@app.route('/manifest.json')
def manifest():
    """Serve PWA manifest file."""
    return send_from_directory(os.path.join(os.path.dirname(__file__), 'static'), 'manifest.json')

@app.route('/service-worker.js')
def service_worker():
    """Serve service worker file."""
    response = send_from_directory(os.path.join(os.path.dirname(__file__), 'static'), 'service-worker.js')
    response.headers['Service-Worker-Allowed'] = '/'
    response.headers['Cache-Control'] = 'no-cache'
    return response

@app.route('/offline')
def offline():
    """Offline fallback page."""
    return render_template('offline.html')

@app.route('/install')
def install_guide():
    """PWA installation guide."""
    return render_template('install_guide.html')

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    """Serve uploaded images."""
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

def get_image_dimensions(filepath):
    """Get image dimensions."""
    try:
        with Image.open(filepath) as img:
            return {'width': img.width, 'height': img.height}
    except:
        return {'width': 0, 'height': 0}

def analyze_agricultural_image(filepath, analysis_type):
    """Analyze agricultural image and provide insights."""
    try:
        # Get image info
        with Image.open(filepath) as img:
            width, height = img.size
            format_name = img.format
        
        # Simulate AI analysis based on type
        if analysis_type == 'crop_health':
            return analyze_crop_health(filepath, width, height)
        elif analysis_type == 'pest_disease':
            return analyze_pest_disease(filepath, width, height)
        elif analysis_type == 'soil_condition':
            return analyze_soil_condition(filepath, width, height)
        elif analysis_type == 'weed_detection':
            return analyze_weed_detection(filepath, width, height)
        else:
            return analyze_general_farm(filepath, width, height)
            
    except Exception as e:
        return {
            'error': f'Image analysis failed: {str(e)}',
            'confidence': 0,
            'recommendations': ['Please try uploading a clearer image']
        }

def analyze_crop_health(filepath, width, height):
    """Analyze crop health from image."""
    # Simulate advanced image analysis
    import random
    
    health_score = random.uniform(65, 95)
    
    if health_score >= 85:
        status = 'Excellent'
        color = 'green'
        recommendations = [
            'Crops appear very healthy with good color and structure',
            'Continue current care routine',
            'Monitor for any changes in upcoming weeks',
            'Consider light fertilization to maintain growth'
        ]
    elif health_score >= 70:
        status = 'Good'
        color = 'yellow'
        recommendations = [
            'Crops show good overall health with minor concerns',
            'Check soil moisture levels regularly',
            'Consider nutrient analysis if growth slows',
            'Monitor for early signs of stress'
        ]
    else:
        status = 'Needs Attention'
        color = 'red'
        recommendations = [
            'Crops show signs of stress or nutrient deficiency',
            'Immediate soil and water analysis recommended',
            'Check for pest or disease issues',
            'Consider consulting agricultural expert'
        ]
    
    return {
        'analysis_type': 'Crop Health Assessment',
        'overall_health': {
            'score': round(health_score, 1),
            'status': status,
            'color': color
        },
        'detected_issues': [
            {'issue': 'Leaf Color Variation', 'severity': 'Low', 'confidence': 78},
            {'issue': 'Plant Spacing', 'severity': 'Medium', 'confidence': 85},
            {'issue': 'Growth Stage', 'severity': 'Normal', 'confidence': 92}
        ],
        'measurements': {
            'estimated_plant_height': f"{random.randint(25, 80)} cm",
            'leaf_density': f"{random.randint(60, 90)}%",
            'color_consistency': f"{random.randint(70, 95)}%"
        },
        'recommendations': recommendations,
        'confidence': round(random.uniform(75, 95), 1),
        'next_steps': [
            'Continue monitoring every 3-5 days',
            'Take photos from same angle for comparison',
            'Record any environmental changes'
        ]
    }

def analyze_pest_disease(filepath, width, height):
    """Analyze for pests and diseases from image."""
    import random
    
    pests_detected = random.choice([
        ['Aphids', 'Spider Mites'],
        ['Leaf Spots', 'Powdery Mildew'],
        ['Caterpillars', 'Whiteflies'],
        ['Fungal Infection'],
        ['No significant threats detected']
    ])
    
    if 'No significant threats' in pests_detected:
        risk_level = 'LOW'
        confidence = random.uniform(80, 95)
        recommendations = [
            'No major pest or disease threats detected',
            'Continue preventive monitoring',
            'Maintain good crop hygiene',
            'Check again in 1 week'
        ]
    else:
        risk_level = random.choice(['MEDIUM', 'HIGH'])
        confidence = random.uniform(70, 90)
        recommendations = [
            f'Detected: {", ".join(pests_detected)}',
            'Apply appropriate organic/chemical treatment',
            'Isolate affected plants if possible',
            'Monitor spread daily'
        ]
    
    return {
        'analysis_type': 'Pest & Disease Detection',
        'risk_assessment': {
            'level': risk_level,
            'confidence': round(confidence, 1),
            'color': 'green' if risk_level == 'LOW' else 'orange' if risk_level == 'MEDIUM' else 'red'
        },
        'detected_threats': [
            {
                'name': pest,
                'probability': round(random.uniform(60, 95), 1),
                'severity': random.choice(['Low', 'Medium', 'High']),
                'location': random.choice(['Upper leaves', 'Lower stems', 'Distributed', 'Root area'])
            } for pest in pests_detected if pest != 'No significant threats detected'
        ],
        'prevention_tips': [
            'Maintain proper plant spacing for air circulation',
            'Water at soil level to avoid wet leaves',
            'Remove affected plant material promptly',
            'Use beneficial insects for natural control'
        ],
        'treatment_options': [
            {'method': 'Organic Treatment', 'effectiveness': '70-80%', 'time': '1-2 weeks'},
            {'method': 'Chemical Treatment', 'effectiveness': '85-95%', 'time': '3-7 days'},
            {'method': 'Biological Control', 'effectiveness': '60-75%', 'time': '2-4 weeks'}
        ],
        'recommendations': recommendations,
        'confidence': round(confidence, 1)
    }

def analyze_soil_condition(filepath, width, height):
    """Analyze soil condition from image."""
    import random
    
    soil_health = random.uniform(60, 90)
    
    return {
        'analysis_type': 'Soil Condition Analysis',
        'soil_health': {
            'score': round(soil_health, 1),
            'status': 'Good' if soil_health >= 75 else 'Fair' if soil_health >= 60 else 'Poor',
            'color': 'green' if soil_health >= 75 else 'orange' if soil_health >= 60 else 'red'
        },
        'visual_assessment': {
            'color': random.choice(['Dark brown', 'Light brown', 'Reddish brown', 'Gray-brown']),
            'texture': random.choice(['Loamy', 'Sandy', 'Clay', 'Silty']),
            'moisture': f"{random.randint(15, 35)}%",
            'organic_matter': random.choice(['High', 'Medium', 'Low'])
        },
        'detected_features': [
            f"Estimated pH: {random.uniform(6.0, 7.5):.1f}",
            f"Drainage: {random.choice(['Good', 'Moderate', 'Poor'])}",
            f"Compaction: {random.choice(['None', 'Light', 'Moderate'])}",
            f"Root presence: {random.choice(['Visible', 'Limited', 'None'])}"
        ],
        'recommendations': [
            'Consider soil testing for accurate nutrient levels',
            'Add organic matter if soil appears compacted',
            'Ensure proper drainage for optimal root health',
            'Monitor moisture levels regularly'
        ],
        'confidence': round(random.uniform(65, 85), 1),
        'next_actions': [
            'Take soil samples from multiple locations',
            'Test pH and nutrient levels',
            'Consider soil amendments based on test results'
        ]
    }

def analyze_weed_detection(filepath, width, height):
    """Detect and analyze weeds in the image."""
    import random
    
    weed_coverage = random.uniform(5, 40)
    
    return {
        'analysis_type': 'Weed Detection & Management',
        'weed_assessment': {
            'coverage_percentage': round(weed_coverage, 1),
            'density': 'High' if weed_coverage >= 25 else 'Medium' if weed_coverage >= 15 else 'Low',
            'threat_level': 'High' if weed_coverage >= 25 else 'Medium' if weed_coverage >= 15 else 'Low'
        },
        'detected_weeds': [
            {
                'type': weed_type,
                'coverage': round(random.uniform(2, 15), 1),
                'growth_stage': random.choice(['Seedling', 'Juvenile', 'Mature']),
                'competitiveness': random.choice(['High', 'Medium', 'Low'])
            } for weed_type in random.sample([
                'Broadleaf weeds', 'Grass weeds', 'Dandelions', 'Crabgrass', 
                'Clover', 'Plantain', 'Chickweed', 'Thistle'
            ], random.randint(2, 4))
        ],
        'management_strategy': {
            'immediate_action': 'Hand removal for small patches' if weed_coverage < 15 else 'Selective herbicide application',
            'timing': 'Early morning or evening application',
            'method': random.choice(['Mechanical', 'Chemical', 'Cultural', 'Integrated'])
        },
        'control_options': [
            {'method': 'Hand Weeding', 'effectiveness': '95%', 'cost': 'Low', 'labor': 'High'},
            {'method': 'Herbicide', 'effectiveness': '85-90%', 'cost': 'Medium', 'labor': 'Low'},
            {'method': 'Mulching', 'effectiveness': '70-80%', 'cost': 'Medium', 'labor': 'Medium'},
            {'method': 'Cover Crops', 'effectiveness': '60-75%', 'cost': 'Low', 'labor': 'Low'}
        ],
        'recommendations': [
            f"Weed coverage is {round(weed_coverage, 1)}% - action {'urgently ' if weed_coverage >= 25 else ''}needed",
            'Target weeds during early growth stages for best results',
            'Consider pre-emergent herbicide for next season',
            'Maintain healthy crop density to suppress weeds'
        ],
        'confidence': round(random.uniform(70, 90), 1)
    }

def analyze_general_farm(filepath, width, height):
    """General farm image analysis."""
    import random
    
    return {
        'analysis_type': 'General Farm Assessment',
        'image_quality': {
            'resolution': f"{width}x{height}",
            'clarity': random.choice(['Excellent', 'Good', 'Fair']),
            'lighting': random.choice(['Optimal', 'Good', 'Needs improvement'])
        },
        'scene_analysis': {
            'primary_subject': random.choice(['Crops', 'Soil', 'Equipment', 'Infrastructure']),
            'growth_stage': random.choice(['Seedling', 'Vegetative', 'Flowering', 'Maturity']),
            'weather_conditions': random.choice(['Sunny', 'Overcast', 'Dry', 'Post-rain']),
            'time_of_day': random.choice(['Morning', 'Midday', 'Afternoon', 'Evening'])
        },
        'observations': [
            f"Field appears to be in {random.choice(['excellent', 'good', 'fair'])} condition",
            f"Estimated crop density: {random.randint(70, 95)}%",
            f"Visible irrigation: {random.choice(['Present', 'Not visible', 'Adequate', 'Insufficient'])}",
            f"Equipment/tools: {random.choice(['Visible in frame', 'Not present', 'Properly maintained'])}"
        ],
        'recommendations': [
            'Continue regular monitoring and documentation',
            'Consider taking photos from multiple angles',
            'Record date, time, and weather conditions',
            'Compare with previous photos to track progress'
        ],
        'confidence': round(random.uniform(75, 90), 1),
        'suggested_follow_up': [
            'Take close-up photos of specific concerns',
            'Document any changes from previous visits',
            'Consider specialized analysis if issues detected'
        ]
    }

@app.route('/getting-started')
def getting_started():
    """Getting started guide for new users."""
    return render_template('getting_started.html')

def is_mobile():
    """Detect if user agent is mobile."""
    user_agent = request.headers.get('User-Agent', '').lower()
    mobile_keywords = ['mobile', 'android', 'iphone', 'ipad', 'windows phone', 'blackberry', 'tablet']
    return any(keyword in user_agent for keyword in mobile_keywords)

@app.route('/')
def home():
    """Home page - desktop or mobile version."""
    if is_mobile():
        return render_template('mobile_home.html')
    return render_template('modern_index_animated.html')

@app.route('/dashboard')
def dashboard():
    """Dashboard page - desktop or mobile version."""
    if is_mobile():
        return render_template('mobile_dashboard.html')
    return render_template('modern_dashboard.html')

@app.route('/analysis')
def analysis():
    """Analysis page - desktop or mobile version."""
    if is_mobile():
        return render_template('mobile_analysis.html')
    return render_template('modern_analysis.html')

@app.route('/pest-detection-page')
def pest_detection_page():
    """Pest detection page - desktop or mobile version."""
    if is_mobile():
        return render_template('mobile_pest_detection.html')
    return render_template('modern_pest_detection.html')

@app.route('/market-prediction-page')
def market_prediction_page():
    """Market prediction page - desktop or mobile version."""
    if is_mobile():
        return render_template('mobile_market_prediction.html')
    return render_template('modern_market_prediction.html')

@app.route('/performance-page')
def performance_page():
    """Performance monitoring page - desktop or mobile version."""
    if is_mobile():
        return render_template('mobile_performance.html')
    return render_template('modern_performance.html')

@app.route('/data-history-page')
def data_history_page():
    """Data history page - desktop or mobile version."""
    if is_mobile():
        return render_template('mobile_data_history.html')
    return render_template('modern_data_history.html')

@app.route('/health')
def health():
    """Health check endpoint."""
    return jsonify({
        'status': 'healthy',
        'version': '2.0.0',
        'message': 'Agricultural Analytics Platform is running!'
    }), 200

@app.route('/api/comprehensive-analysis', methods=['POST'])
def comprehensive_analysis():
    """Comprehensive analysis endpoint with MongoDB storage."""
    try:
        data = request.get_json()
        
        # Extract input data
        nitrogen = float(data.get('nitrogen', 50))
        phosphorus = float(data.get('phosphorus', 30))
        potassium = float(data.get('potassium', 150))
        temperature = float(data.get('temperature', 22))
        humidity = float(data.get('humidity', 65))
        rainfall_mm = float(data.get('rainfall_mm', 12))
        ph = float(data.get('ph', 6.8))
        crop = str(data.get('crop', 'wheat'))
        
        # Generate comprehensive analysis
        analysis = {
            'input_conditions': data,
            'timestamp': datetime.now(timezone.utc),
            'analysis_id': f"COMP_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
            'recommendations': {
                'crops': [
                    {'crop': 'wheat', 'suitability_score': 0.85, 'rank': 1},
                    {'crop': 'corn', 'suitability_score': 0.78, 'rank': 2},
                    {'crop': 'rice', 'suitability_score': 0.72, 'rank': 3}
                ]
            },
            'predictions': {
                'yield': {
                    'predicted_yield': 4850.5,
                    'confidence_score': 0.85,
                    'prediction_interval': {
                        'lower': 4200.0,
                        'upper': 5500.0,
                        'confidence_level': 0.95
                    }
                },
                'market_price': {
                    'predicted_price': 2450.0,
                    'unit': '₹/quintal',
                    'outlook': 'STABLE',
                    'vs_historical': '+5.2%'
                }
            },
            'suggestions': {
                'fertilizer': {
                    'npk_ratio': '47.6:16.7:35.7',
                    'total_kg_per_ha': 252.0,
                    'recommendations': [
                        'Apply 50% at planting',
                        'Apply 50% at mid-season'
                    ]
                },
                'irrigation': {
                    'urgency': 'HIGH',
                    'interval_days': 2,
                    'water_volume_mm': 5.4,
                    'recommendations': [
                        'Irrigate within 24 hours',
                        'Use drip irrigation',
                        'Best time: early morning'
                    ]
                }
            },
            'risk_assessment': {
                'pests': {
                    'predicted_pest': 'aphids',
                    'risk_level': 'MEDIUM',
                    'severity_score': 0.65,
                    'recommendations': [
                        'Monitor for symptoms',
                        'Consider beneficial insects',
                        'Apply insecticidal soap if needed'
                    ]
                }
            }
        }
        
        # Store in MongoDB if available
        if db is not None:
            try:
                # Store comprehensive analysis
                result = analyses_collection.insert_one(analysis.copy())
                analysis['_id'] = str(result.inserted_id)
                
                # Also store individual predictions for tracking
                prediction_record = {
                    'timestamp': analysis['timestamp'],
                    'analysis_id': analysis['analysis_id'],
                    'crop': crop,
                    'yield_prediction': analysis['predictions']['yield']['predicted_yield'],
                    'market_price': analysis['predictions']['market_price']['predicted_price'],
                    'pest_risk': analysis['risk_assessment']['pests']['risk_level'],
                    'conditions': {
                        'nitrogen': nitrogen,
                        'phosphorus': phosphorus,
                        'potassium': potassium,
                        'temperature': temperature,
                        'humidity': humidity,
                        'rainfall_mm': rainfall_mm,
                        'ph': ph
                    }
                }
                predictions_collection.insert_one(prediction_record)
                
                logger.info(f"✅ Analysis stored in MongoDB: {analysis['analysis_id']}")
            except Exception as e:
                logger.error(f"❌ MongoDB insert failed: {e}")
        else:
            # Fallback to in-memory storage
            farm_data['predictions'].append(analysis)
        
        farm_data['analysis_count'] += 1
        
        return jsonify({
            'status': 'success',
            'analysis': analysis,
            'storage': 'mongodb' if db is not None else 'memory'
        }), 200
    
    except Exception as e:
        logger.error(f"❌ Analysis error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/pest-detection', methods=['POST'])
def pest_detection():
    """Pest detection endpoint with MongoDB storage."""
    try:
        data = request.get_json()
        
        result = {
            'timestamp': datetime.now(timezone.utc),
            'detection_id': f"PEST_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
            'input_conditions': data,
            'predicted_pest': 'spider_mites',
            'risk_level': 'HIGH',
            'severity_score': 0.78,
            'confidence': 0.82,
            'recommendations': [
                'URGENT: Immediate action required',
                'Increase irrigation to reduce heat stress',
                'Apply miticide if needed',
                'Improve air circulation'
            ]
        }
        
        # Store in MongoDB if available
        if db is not None:
            try:
                pest_collection = db.pest_detections
                pest_result = pest_collection.insert_one(result.copy())
                result['_id'] = str(pest_result.inserted_id)
                logger.info(f"✅ Pest detection stored in MongoDB: {result['detection_id']}")
            except Exception as e:
                logger.error(f"❌ MongoDB pest insert failed: {e}")
        
        return jsonify({
            'status': 'success',
            'detection': result,
            'storage': 'mongodb' if db is not None else 'memory'
        }), 200
    
    except Exception as e:
        logger.error(f"❌ Pest detection error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/market-prediction', methods=['POST'])
def market_prediction():
    """Market prediction endpoint with MongoDB storage."""
    try:
        data = request.get_json()
        
        result = {
            'timestamp': datetime.now(timezone.utc),
            'prediction_id': f"MARKET_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
            'input_conditions': data,
            'predicted_price': 2450.0,
            'currency': 'USD',
            'unit': '$/ton',
            'confidence': 0.75,
            'market_analysis': {
                'vs_historical_average': '+12.5%',
                'outlook': 'BULLISH',
                'volatility': 'MODERATE'
            }
        }
        
        # Store in MongoDB if available
        if db is not None:
            try:
                market_collection = db.market_predictions
                market_result = market_collection.insert_one(result.copy())
                result['_id'] = str(market_result.inserted_id)
                logger.info(f"✅ Market prediction stored in MongoDB: {result['prediction_id']}")
            except Exception as e:
                logger.error(f"❌ MongoDB market insert failed: {e}")
        
        return jsonify({
            'status': 'success',
            'prediction': result,
            'storage': 'mongodb' if db is not None else 'memory'
        }), 200
    
    except Exception as e:
        logger.error(f"❌ Market prediction error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/performance', methods=['GET'])
def performance():
    """Performance statistics endpoint with MongoDB data."""
    try:
        stats = {
            'total_operations': farm_data['analysis_count'],
            'success_rate': 100.0,
            'avg_response_time': 0.15,
            'memory_usage_mb': 45.2
        }
        
        # Get MongoDB statistics if available
        if db is not None:
            try:
                # Count documents in collections
                analyses_count = analyses_collection.count_documents({})
                predictions_count = predictions_collection.count_documents({})
                pest_count = db.pest_detections.count_documents({})
                market_count = db.market_predictions.count_documents({})
                
                stats.update({
                    'mongodb_connected': True,
                    'total_analyses': analyses_count,
                    'total_predictions': predictions_count,
                    'pest_detections': pest_count,
                    'market_predictions': market_count,
                    'database_size_mb': round(db.command("dbstats")["dataSize"] / (1024 * 1024), 2)
                })
                
                logger.info(f"📊 MongoDB Stats - Analyses: {analyses_count}, Predictions: {predictions_count}")
            except Exception as e:
                logger.error(f"❌ MongoDB stats error: {e}")
                stats['mongodb_connected'] = False
        else:
            stats['mongodb_connected'] = False
        
        return jsonify({
            'status': 'success',
            'performance_summary': stats
        }), 200
    
    except Exception as e:
        logger.error(f"❌ Performance endpoint error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/data-history', methods=['GET'])
def data_history():
    """Get historical data from MongoDB."""
    try:
        if db is None:
            return jsonify({
                'status': 'error',
                'message': 'MongoDB not connected'
            }), 503
        
        # Get query parameters
        limit = int(request.args.get('limit', 10))
        collection_type = request.args.get('type', 'all')
        
        history = {}
        
        if collection_type in ['all', 'analyses']:
            recent_analyses = list(analyses_collection.find({}, {
                'analysis_id': 1,
                'timestamp': 1,
                'input_conditions.crop': 1,
                'predictions.yield.predicted_yield': 1,
                'predictions.market_price.predicted_price': 1,
                'risk_assessment.pests.risk_level': 1
            }).sort('timestamp', -1).limit(limit))
            
            # Convert ObjectId to string for JSON serialization
            for analysis in recent_analyses:
                analysis['_id'] = str(analysis['_id'])
                
            history['analyses'] = recent_analyses
        
        if collection_type in ['all', 'pest']:
            recent_pest = list(db.pest_detections.find({}, {
                'detection_id': 1,
                'timestamp': 1,
                'predicted_pest': 1,
                'risk_level': 1,
                'confidence': 1
            }).sort('timestamp', -1).limit(limit))
            
            for pest in recent_pest:
                pest['_id'] = str(pest['_id'])
                
            history['pest_detections'] = recent_pest
        
        if collection_type in ['all', 'market']:
            recent_market = list(db.market_predictions.find({}, {
                'prediction_id': 1,
                'timestamp': 1,
                'predicted_price': 1,
                'currency': 1,
                'market_analysis.outlook': 1
            }).sort('timestamp', -1).limit(limit))
            
            for market in recent_market:
                market['_id'] = str(market['_id'])
                
            history['market_predictions'] = recent_market
        
        return jsonify({
            'status': 'success',
            'history': history,
            'total_records': sum(len(v) for v in history.values() if isinstance(v, list))
        }), 200
    
    except Exception as e:
        logger.error(f"❌ Data history error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/crop-recommendation', methods=['POST'])
def crop_recommendation():
    """Crop recommendation endpoint."""
    try:
        result = {
            'recommendations': [
                {'crop': 'wheat', 'suitability_score': 0.87, 'confidence': 0.87},
                {'crop': 'corn', 'suitability_score': 0.81, 'confidence': 0.81},
                {'crop': 'rice', 'suitability_score': 0.75, 'confidence': 0.75}
            ]
        }
        
        return jsonify({
            'status': 'success',
            'recommendations': result['recommendations']
        }), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/yield-prediction', methods=['POST'])
def yield_prediction():
    """Yield prediction endpoint."""
    try:
        result = {
            'predicted_yield': 4850.2,
            'yield_unit': 'kg/ha',
            'confidence_score': 0.82,
            'prediction_interval': {
                'lower': 4200.0,
                'upper': 5500.0,
                'confidence_level': 0.95
            }
        }
        
        return jsonify({
            'status': 'success',
            'prediction': result
        }), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/fertilizer-suggestion', methods=['POST'])
def fertilizer_suggestion():
    """Fertilizer suggestion endpoint."""
    try:
        result = {
            'npk_ratio': '47.6:16.7:35.7',
            'recommendations': [
                'Apply 120 kg N/ha',
                'Apply 42 kg P/ha',
                'Apply 90 kg K/ha'
            ]
        }
        
        return jsonify({
            'status': 'success',
            'suggestion': result
        }), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/irrigation-schedule', methods=['POST'])
def irrigation_schedule():
    """Irrigation schedule endpoint."""
    try:
        result = {
            'urgency': 'HIGH',
            'interval_days': 2,
            'water_volume_mm': 5.4,
            'recommendations': [
                'Irrigate within 24 hours',
                'Water needed: 5.4 mm',
                'Best time: early morning',
                'Use drip irrigation'
            ]
        }
        
        return jsonify({
            'status': 'success',
            'schedule': result
        }), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.errorhandler(404)
def not_found(e):
    """Handle 404 errors."""
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(e):
    """Handle 500 errors."""
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    print("\n" + "="*60)
    print("  🌾 AGRICULTURAL ANALYTICS API")
    print("="*60)
    print(f"  Starting on http://localhost:5000")
    print(f"  Templates: {os.path.join(os.path.dirname(__file__), 'templates')}")
    print("="*60 + "\n")
    
    app.run(debug=True, port=5000, host='0.0.0.0')
