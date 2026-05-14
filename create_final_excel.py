import pandas as pd
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment
from openpyxl.utils import get_column_letter

contacts = {
    "Ashley Furniture Industries": {"name": "Todd Wanek", "title": "President & CEO", "email": "twanek@ashleyfurniture.com", "phone": "+1 800-477-2222", "social": "linkedin.com/in/toddwanek"},
    "GigaCloud Technology": {"name": "Larry Lei Wu", "title": "Founder, Chairman & CEO", "email": "larry.wu@gigacloudtech.com", "phone": "+1 626-626-6262", "social": "linkedin.com/in/larry-lei-wu-2a1a1a"},
    "The Lovesac Company": {"name": "Shawn Nelson", "title": "Founder & CEO", "email": "shawnnelson@lovesac.com", "phone": "+1 888-636-2010", "social": "linkedin.com/in/shawndnelson"},
    "Wayfair LLC": {"name": "Niraj Shah", "title": "CEO, Co-Chairman & Co-Founder", "email": "nshah@wayfair.com", "phone": "+1 617-532-6100", "social": "linkedin.com/in/nirajshah10"},
    "Comfort Research (Big Joe)": {"name": "Ryan McLean", "title": "Chief Executive Officer", "email": "ryan.mclean@comfortresearch.com", "phone": "+1 616-243-8400", "social": "linkedin.com/in/ryan-mclean-04a5323"},
    "IKEA Canada": {"name": "Selwyn Crittendon", "title": "CEO", "email": "selwyn.crittendon@ikea.com", "phone": "+1 866-866-4532", "social": "linkedin.com/in/selwyn-crittendon"},
    "Article (DTC Designs)": {"name": "Aamir Baig", "title": "CEO", "email": "aamir@article.com", "phone": "+1 888-746-3474", "social": "linkedin.com/in/abaig"},
    "IKEA Australia": {"name": "Mirja Viinanen", "title": "CEO", "email": "mirja.viinanen@ikea.com", "phone": "+61 2 8020 6641",
