'use client';
import { useEffect, useState } from 'react';
import { Typography, CircularProgress, Grid } from '@mui/material';
import PageContainer from '@/app/(Dashboard)/components/container/PageContainer';
import DashboardCard from '@/app/(Dashboard)/components/shared/DashboardCard';
import axios from 'axios';

const SamplePage = () => {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/SlideShow`, {
          responseType: 'json',
        });

        console.log('API Response:', response.data);

        if (!Array.isArray(response.data)) {
          throw new Error('Invalid response format: expected an array');
        }

        const imageUrls = response.data.map((item: { url: string }) => item.url);
        console.log('Image URLs from API:', imageUrls);

        const imageBlobs = await Promise.all(
          imageUrls.map(async (url) => {
            try {
              console.log('Fetching image from URL:', url);
              const blobResponse = await axios.get(url, { responseType: 'blob' });
              console.log('Blob Response:', blobResponse);

              const imageUrl = URL.createObjectURL(blobResponse.data);
              console.log('Created Image URL:', imageUrl);
              return imageUrl;
            } catch (err) {
              console.error('Error fetching image blob from URL:', url, err);
              throw err;
            }
          })
        );

        setImages(imageBlobs);
      } catch (err) {
        console.error('Error fetching images:', err);
        setError(err.message || 'Error fetching images');
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  return (
    <PageContainer title="Sample Page" description="This is a Sample page">
      <DashboardCard title="Sample Page">
        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Typography color="error">Failed to load images: {error}</Typography>
        ) : (
          <Grid container spacing={2}>
            {images.map((image, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <img src={image} alt={`Sample ${index + 1}`} style={{ width: '100%', height: 'auto' }} />
              </Grid>
            ))}
          </Grid>
        )}
      </DashboardCard>
    </PageContainer>
  );
};

export default SamplePage;
