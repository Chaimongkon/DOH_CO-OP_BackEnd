"use client"
import { useState } from 'react';

const ImageUpload = () => {
    const [file, setFile] = useState<File | null>(null);
    const API = process.env.NEXT_PUBLIC_API_BASE_URL;
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setFile(event.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (file) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = async () => {
                const base64String = reader.result?.toString().split(',')[1];
 
                if (base64String) {
                    const response = await fetch(`${API}SlideShow/Create`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ image: base64String }),
                    });

                    if (response.ok) {
                        alert('Image uploaded successfully!');
                    } else {
                        alert('Failed to upload image.');
                    }
                }
            };
        }
    };

    return (
        <div>
            <input type="file" accept="image/*" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload</button>
        </div>
    );
};

export default ImageUpload;
