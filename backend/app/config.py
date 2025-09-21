#config.py
INSTITUTION_CONFIG = {
    "JHAR": {
        "seal": {
            "roi":  [0.745, 0.047, 0.933, 0.263],
            "reference_image": "backend/assets/seals/jhar_seal.png",
            "threshold": 0.25
        },
        "signature": {
            "roi":  [0.513, 0.789, 0.729, 0.904],
            "reference_image": "backend/assets/signatures/jhar_signature.png",
            "threshold": 0.3
        }
    },
    "RANC": {
        "seal": {
            "roi": [0.417, 0.025, 0.580, 0.248],
            "reference_image": "backend/assets/seals/ranc_seal.png",
            "threshold": 0.25
        },
        "signature": {
            "roi": [0.591, 0.743, 0.856, 0.838],
            "reference_image": "backend/assets/signatures/ranc_signature.png",
            "threshold": 0.4
        }
    },
    "JHAR_BS": {
        "seal": {
            "roi":[0.387, 0.035, 0.617, 0.292],
            "reference_image": "backend/assets/seals/jhar_bs_seal.png",
            "threshold": 0.25
        },
        "signature": {
            "roi": [0.722, 0.770, 0.897, 0.868],
            "reference_image": "backend/assets/signatures/jhar_bs_signature.png",
            "threshold": 0.2
        }
    }
}

INSTITUTION_NAME_TO_CODE = {
    "Jharkhand State University": "JHAR",
    "Ranchi Tech Institute": "RANC",
    "Jharkhand Business School": "JHAR_BS"
}

OCR_INSTITUTION_MAPPING = {
    "jharkhand state university": "Jharkhand State University",
    "ranchi tech institute": "Ranchi Tech Institute",
    "jharkhand business school": "Jharkhand Business School",
    "jsu": "Jharkhand State University",
    "rti": "Ranchi Tech Institute",
    "jbs": "Jharkhand Business School"
}