#!/bin/bash

# CBAM Background Video Setup Script
# Bu script video dosyalarını indirmek için kullanılabilir

echo "CBAM Background Video Setup"
echo "=========================="

# Video dosyaları için dizin oluştur
mkdir -p public/videos

echo "Video dosyalarını public/videos/ klasörüne yerleştirin:"
echo ""
echo "1. factory-1.mp4 - Fabrika ve endüstri görüntüleri"
echo "2. renewable-energy.mp4 - Yenilenebilir enerji kaynakları" 
echo "3. carbon-emissions.mp4 - Karbon emisyonları ve çevre"
echo ""
echo "Önerilen özellikler:"
echo "- Format: MP4"
echo "- Süre: 30-60 saniye"
echo "- Çözünürlük: 1920x1080"
echo "- Maksimum boyut: 50MB"
echo "- Ses: Kapalı (muted)"
echo ""
echo "Video dosyaları bulunmadığında otomatik olarak gradient background kullanılacaktır."