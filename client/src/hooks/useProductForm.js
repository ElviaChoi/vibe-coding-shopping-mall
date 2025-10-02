import { useState } from 'react';

export const useProductForm = () => {
  const [formData, setFormData] = useState({
    sku: '',
    name: '',
    description: '',
    price: '',
    mainCategory: '',
    subCategory: '',
    images: [],
    sizes: []
  });

  const [selectedSizes, setSelectedSizes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'mainCategory') {
      setSelectedSizes([]);
      setFormData(prev => ({
        ...prev,
        [name]: value,
        subCategory: '',
        sizes: []
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSizeToggle = (size) => {
    setSelectedSizes(prev => {
      if (prev.includes(size)) {
        return prev.filter(s => s !== size);
      } else {
        return [...prev, size];
      }
    });
  };

  const handleStockChange = (size, stock) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.map(s => 
        s.size === size ? { ...s, stock: parseInt(stock) || 0 } : s
      ).concat(
        !prev.sizes.find(s => s.size === size) ? [{ size, stock: parseInt(stock) || 0 }] : []
      )
    }));
  };

  const handleImageUpload = (newImage) => {
    setFormData(prev => {
      const existingImage = prev.images.find(img => img.publicId === newImage.publicId);
      if (existingImage) {
        return prev;
      }
      
      const imageWithMain = {
        ...newImage,
        isMain: prev.images.length === 0,
        alt: `상품 이미지 ${prev.images.length + 1}`
      };
      
      return {
        ...prev,
        images: [...prev.images, imageWithMain]
      };
    });
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const resetForm = () => {
    setFormData({
      sku: '',
      name: '',
      description: '',
      price: '',
      mainCategory: '',
      subCategory: '',
      images: [],
      sizes: []
    });
    setSelectedSizes([]);
    setError(null);
  };

  return {
    formData,
    selectedSizes,
    isLoading,
    error,
    setError,
    setIsLoading,
    handleInputChange,
    handleSizeToggle,
    handleStockChange,
    handleImageUpload,
    removeImage,
    resetForm
  };
};
