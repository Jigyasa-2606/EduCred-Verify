# backend/app/config.py
# Predefined templates for each institution based on their certificate layout
INSTITUTION_CONFIG = {
    "JHAR": {  # Jharkhand State University
        "seal": {
            "roi": [0.419, 0.172, 0.587, 0.318],
            "reference_image": "backend/assets/seals/jhar_seal.png",
            "threshold": 0.3  # Lowered for testing
        },
        "signature": {
            "roi": [0.585, 0.683, 0.725, 0.737],
            "reference_image": "backend/assets/signatures/jhar_signature.png",
            "threshold": 0.05  # Lowered for testing
        }
    },
    "RANC": {  # Ranchi Tech Institute
        "seal": {
            "roi": [0.426, 0.209, 0.580, 0.340],
            "reference_image": "backend/assets/seals/ranc_seal.png",
            "threshold": 0.3
        },
        "signature": {
            "roi": [0.564, 0.709, 0.702, 0.741],
            "reference_image": "backend/assets/signatures/ranc_signature.png",
            "threshold": 0.05
        }
    },
    "JHAR_BS": {  # Jharkhand Business School
        "seal": {
            "roi": [0.432, 0.279, 0.587, 0.393],
            "reference_image": "backend/assets/seals/jhar_bs_seal.png",
            "threshold": 0.3
        },
        "signature": {
            "roi": [0.695, 0.671, 0.813, 0.702],
            "reference_image": "backend/assets/signatures/jhar_bs_signature.png",
            "threshold": 0.05
        }
    }
}

# Mapping from full institution name to code
INSTITUTION_NAME_TO_CODE = {
    "Jharkhand State University": "JHAR",
    "Ranchi Tech Institute": "RANC", 
    "Jharkhand Business School": "JHAR_BS"
}

# Mapping from common OCR variations to standard names
OCR_INSTITUTION_MAPPING = {
    "jharkhand state university": "Jharkhand State University",
    "ranchi tech institute": "Ranchi Tech Institute", 
    "jharkhand business school": "Jharkhand Business School",
    "jsu": "Jharkhand State University",
    "rti": "Ranchi Tech Institute",
    "jbs": "Jharkhand Business School"
}