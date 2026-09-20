import sys
from rembg import remove
from PIL import Image

try:
    print('Loading image...')
    input_path = 'rutu.jpg'
    output_path = 'rutu_nobg.png'
    
    with open(input_path, 'rb') as i:
        input_data = i.read()
    
    print('Removing background...')
    output_data = remove(input_data)
    
    with open(output_path, 'wb') as o:
        o.write(output_data)
        
    print('Background removed successfully!')
except Exception as e:
    print('Error:', e)
