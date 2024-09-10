"use client"
import { useEffect, useState } from 'react';

const PhotoAlbum = ({ albumId }: { albumId: string }) => {
  const [title, setTitle] = useState<string | null>(null);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [allImages, setAllImages] = useState<string[]>([]);
  const [showAllImages, setShowAllImages] = useState(false);
  const API = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchCoverImageAndTitle = async () => {
      try {
        const response = await fetch(`${API}Photos/GetCoverById/${albumId}`);
        const data = await response.json();
        if (response.ok) {
          setTitle(data.title);
          setCoverImage(data.cover);
        } else {
          console.error('Error fetching album data:', data.message);
        }
      } catch (error) {
        console.error('Error fetching album data:', error);
      }
    };
  
    fetchCoverImageAndTitle();
  }, [albumId, API]); // Ensure these dependencies are correct and minimal
  

  const handleShowAllImages = async () => {
    if (allImages.length === 0) {
      try {
        const response = await fetch(`${API}Photos/GetAll/${albumId}`);
        const data = await response.json();
        if (response.ok) {
          setAllImages(data.images);
        } else {
          console.error('Error fetching images:', data.message);
        }
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    }
    setShowAllImages(true);
  };

  return (
    <div>
      {coverImage && (
        <div>
          <h2>{title}</h2>
          <img
            src={coverImage}
            alt="Cover"
            style={{ width: '300px', height: '200px', cursor: 'pointer' }}
            onClick={handleShowAllImages}
          />
        </div>
      )}

      {showAllImages && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '20px' }}>
          {allImages.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Image ${index + 1}`}
              style={{ width: '200px', height: '150px', objectFit: 'cover' }}
            />
          ))}
        </div>
      )}
          <div>
      <h1>Photo Album</h1>
      <PhotoAlbum albumId="1" /> {/* Replace "1" with the actual album ID */}
    </div>
    </div>
  );
};

export default PhotoAlbum;
