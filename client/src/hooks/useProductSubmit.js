import { productAPI } from '../utils/api';

export const useProductSubmit = () => {
  const submitProduct = async (formData, selectedSizes, setError, setIsLoading, navigate) => {
    setError(null);
    setIsLoading(true);
    
    if (!formData.sku || !formData.name || !formData.price || !formData.mainCategory || !formData.subCategory) {
      setError('필수 항목을 모두 입력해주세요.');
      setIsLoading(false);
      return;
    }

    if (formData.images.length === 0) {
      setError('최소 1개의 이미지를 업로드해주세요.');
      setIsLoading(false);
      return;
    }

    if (formData.mainCategory !== 'accessories' && selectedSizes.length === 0) {
      setError('최소 1개의 사이즈를 선택해주세요.');
      setIsLoading(false);
      return;
    }

    try {
      let sizesWithStock;
      
      if (formData.mainCategory === 'accessories') {
        const freeStock = formData.sizes.find(s => s.size === 'Free')?.stock || 0;
        sizesWithStock = [{ size: 'Free', stock: freeStock }];
      } else {
        sizesWithStock = selectedSizes.map(size => {
          const existingSize = formData.sizes.find(s => s.size === size);
          return {
            size,
            stock: existingSize ? existingSize.stock : 0
          };
        });
      }

      const submitData = {
        sku: formData.sku.toUpperCase(),
        name: formData.name,
        description: formData.description,
        price: parseInt(formData.price),
        mainCategory: formData.mainCategory,
        subCategory: formData.subCategory,
        images: formData.images.map(img => ({
          url: img.url,
          alt: img.alt,
          isMain: img.isMain
        })),
        sizes: sizesWithStock
      };

      const response = await productAPI.createProduct(submitData);
      
      if (response.success) {
        alert('상품이 성공적으로 등록되었습니다.');
        navigate('/admin/products?refresh=' + Date.now());
      } else {
        setError(response.message || '상품 등록 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('상품 등록 오류:', error);
      setError(error.message || '상품 등록 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return { submitProduct };
};
