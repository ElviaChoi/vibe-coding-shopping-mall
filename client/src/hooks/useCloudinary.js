import { useState, useEffect } from 'react';

export const useCloudinary = (onImageUpload) => {
  const [cloudinaryWidget, setCloudinaryWidget] = useState(null);

  useEffect(() => {
    const initializeCloudinaryWidget = () => {
      if (window.cloudinary) {
        const widget = window.cloudinary.createUploadWidget(
          {
            cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'demo',
            uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'ml_default',
            sources: ['local', 'url', 'camera'],
            multiple: true,
            maxFiles: 10,
            cropping: true,
            croppingAspectRatio: null,
            showSkipCropButton: true,
            croppingShowDimensions: true,
            croppingShowBackButton: true,
            folder: 'shopping-mall/products',
            resourceType: 'image',
            clientAllowedFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
            maxImageFileSize: 5000000,
            theme: 'minimal',
            styles: {
              palette: {
                window: '#FFFFFF',
                sourceBg: '#F4F4F5',
                windowBorder: '#90A0B3',
                tabIcon: '#000000',
                inactiveTabIcon: '#555A5F',
                menuIcons: '#555A5F',
                link: '#0433FF',
                action: '#339933',
                inProgress: '#0433FF',
                complete: '#20B832',
                error: '#EA2727',
                textDark: '#000000',
                textLight: '#FFFFFF'
              },
              fonts: {
                default: null,
                "'Poppins', sans-serif": {
                  url: 'https://fonts.googleapis.com/css?family=Poppins',
                  active: true
                }
              }
            }
          },
          (error, result) => {
            if (!error && result && result.event === 'success') {
              const newImage = {
                url: result.info.secure_url,
                alt: `상품 이미지`,
                isMain: false,
                publicId: result.info.public_id,
                width: result.info.width,
                height: result.info.height
              };
              onImageUpload(newImage);
            }
          }
        );
        
        setCloudinaryWidget(widget);
      }
    };

    if (window.cloudinary) {
      initializeCloudinaryWidget();
    } else {
      const script = document.createElement('script');
      script.src = 'https://widget.cloudinary.com/v2.0/global/all.js';
      script.async = true;
      script.onload = initializeCloudinaryWidget;
      document.head.appendChild(script);
    }

    return () => {
      if (cloudinaryWidget) {
        cloudinaryWidget.destroy();
      }
    };
  }, []);

  const openWidget = () => {
    if (cloudinaryWidget) {
      cloudinaryWidget.open();
    }
  };

  return { openWidget };
};
