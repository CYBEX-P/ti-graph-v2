import sys
from tiweb import app

import home
import api

if __name__ == "__main__":
    app.run(host='0.0.0.0',debug=True)

