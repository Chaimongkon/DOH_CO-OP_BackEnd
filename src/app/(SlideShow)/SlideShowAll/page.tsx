"use client";
import { useEffect, useState } from 'react';

interface Image {
    id: number;
    image: string; // The base64 image data
}

const ImageList = () => {
    const [images, setImages] = useState<Image[]>([]);
    const API = process.env.NEXT_PUBLIC_API_BASE_URL;
    console.log('Raw data from API:', images);
    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await fetch(`${API}/SlideShow`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                console.log('Raw data from API:', data);

                // Assuming the image data is base64 encoded
                const processedData = data.map((img: any) => ({
                    id: img.slider_id, // Use the correct property name as per your API response
                    image: `data:image/png;base64,${img.slider_image}`, // Prefix with the appropriate data URL scheme
                }));

                setImages(processedData);
            } catch (error) {
                console.error('Failed to fetch images:', error);
            }
        };

        fetchImages();
    }, [API]);

    return (
        <div>
            {images.map((img) => (
                <img key={img.id} src={img.image} alt={`Image ${img.id}`} />
            ))}
        </div>
    );
};

export default ImageList;
