"use client";
import { useEffect, useState } from "react";
import { Card, Row, Col, Spin, Modal, Upload, Button, message } from "antd";
import {
  UploadOutlined,
  EditOutlined,
  SettingOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { Image } from "antd";
import DashboardCard from "@/app/(Dashboard)/components/shared/DashboardCard";

const { Meta } = Card;

const PhotoDetailsPage = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const [images, setImages] = useState<string[]>([]);
  const [title, setTitle] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [editingImage, setEditingImage] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [isAddMode, setIsAddMode] = useState(false); // Track whether we are adding or editing
  const API = process.env.NEXT_PUBLIC_API_BASE_URL;
  const URLImg = process.env.NEXT_PUBLIC_PICHER_BASE_URL;
  // Fetch images on component mount
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get(`${API}/Photos/GetAllById/${id}`);
        setImages(response.data.images);
        setTitle(response.data.title);
      } catch (error) {
        console.error("Error fetching images:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [id]);

  // Handle image edit selection
  const handleEdit = (index: number) => {
    setEditingImage(images[index]); // Set the image being edited
    setIsAddMode(false); // Ensure we are not in add mode
    setIsModalVisible(true);
  };

  // Handle adding a new image
  const handleAdd = () => {
    setEditingImage(null); // Clear any selected image
    setIsAddMode(true); // Enable add mode
    setNewImageFile(null); // Reset newImageFile
    setIsModalVisible(true);
  };

  // Handle file upload selection
  const handleUpload = ({ file }: any) => {
    setNewImageFile(file);
  };

  // Handle saving the new image (for adding)
  const handleSaveAdd = async () => {
    if (newImageFile) {
      const formData = new FormData();
      formData.append("image", newImageFile);
      formData.append("id", id);

      try {
        const response = await axios.post(`${API}/Photos/Add`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.data.success) {
          setImages([...images, response.data.newImagePath]); 
          setIsModalVisible(false);
          setNewImageFile(null); 
          message.success("Image added successfully");
        } else {
          message.error("Failed to add image");
        }
      } catch (error) {
        console.error("Error adding image:", error);
        message.error("Error adding image");
      }
    } else {
      message.error("No image selected");
    }
  };

  // Handle saving the edited image
  const handleSaveEdit = async () => {
    if (newImageFile && editingImage !== null) {
      const formData = new FormData();
      formData.append("image", newImageFile);
      formData.append("id", id);
      formData.append("index", images.indexOf(editingImage).toString()); // Pass the index to backend

      try {
        const response = await axios.put(`${API}/Photos/Edit/${id}`, formData);

        if (response.data.success) {
          const updatedImages = [...images];
          updatedImages[images.indexOf(editingImage)] =
            response.data.newImagePath; // Update the specific image
          setImages(updatedImages);
          setIsModalVisible(false);
          setNewImageFile(null); // Reset the newImageFile after saving
        }
      } catch (error) {
        console.error("Error updating image:", error);
        message.error("Error updating image");
      }
    }
  };

  // Handle image deletion
  const handleDelete = async (index: number) => {
    try {
      const response = await axios.delete(`${API}/Photos/Delete`, {
        data: { id, index }, // Send ID and index to the backend
      });

      if (response.data.success) {
        const updatedImages = [...images];
        updatedImages.splice(index, 1); // Remove the deleted image from the list
        setImages(updatedImages);
        message.success("Image deleted successfully");
      } else {
        message.error("Failed to delete image");
      }
    } catch (error) {
      console.error("Error deleting image:", error);
      message.error("Error deleting image");
    }
  };

  // Show loading spinner while images are being fetched
  if (loading) {
    return (
      <DashboardCard title="Photo ${title}">
        <Spin tip="Loading images..." />
      </DashboardCard>
    );
  }

  return (
    <DashboardCard title={`PhotoAlbum - ${title}`}>
      <div>
        <Row gutter={[16, 16]}>
          {images.map((image, index) => (
            <Col xs={24} sm={12} md={8} lg={6} key={index}>
              <Card
                hoverable
                cover={<Image width={220} src={`${URLImg}${image}`} />}
                actions={[
                  <EditOutlined key="edit" onClick={() => handleEdit(index)} />,
                  <DeleteOutlined
                    key="delete"
                    onClick={() => handleDelete(index)}
                  />,
                ]}
                bodyStyle={{ padding: "0" }}
              />
            </Col>
          ))}
          <Col xs={24} sm={12} md={8} lg={6}>
            <Card
              hoverable
              onClick={handleAdd}
              cover={
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                  }}
                >
                  <PlusOutlined
                    style={{ fontSize: "48px", padding: 40, color: "#1890ff" }}
                  />
                </div>
              }
            >
              <Meta
                title="เพิ่มรูปภาพในอัลบั่มนี้"
                style={{
                  textAlign: "center",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              />
            </Card>
          </Col>
        </Row>

        <Modal
          title={isAddMode ? "Add New Image" : "Edit Image"}
          visible={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          onOk={isAddMode ? handleSaveAdd : handleSaveEdit} // Conditional save function
          okText={isAddMode ? "Add" : "Save"}
        >
          {newImageFile ? (
            <div>
              <p>{isAddMode ? "New Image:" : "Edit Image:"}</p>
              <img
                src={URL.createObjectURL(newImageFile)}
                alt="Preview"
                style={{ marginTop: 16, width: "100%" }}
              />
            </div>
          ) : (
            !isAddMode && (
              <div>
                <p>Original Image:</p>
                <img
                  src={editingImage ?? undefined}
                  alt="Original"
                  style={{ marginBottom: 16, width: "100%" }}
                />
              </div>
            )
          )}

          {!newImageFile && (
            <Upload
              listType="picture"
              showUploadList={false}
              beforeUpload={() => false} // Disable auto upload
              onChange={handleUpload}
            >
              <Button icon={<UploadOutlined />}>
                {isAddMode ? "Upload New Image" : "Change Image"}
              </Button>
            </Upload>
          )}
        </Modal>
      </div>
    </DashboardCard>
  );
};

export default PhotoDetailsPage;
