"use client";
import { useCallback, useEffect, useState } from "react";
import { Card, Row, Col, Spin, Modal, Upload, Button, message } from "antd";
import {
  UploadOutlined,
  EditOutlined,
  SettingOutlined,
  DeleteOutlined,
  PlusOutlined,
  LoadingOutlined,
  RetweetOutlined,
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
  const URLFile = process.env.NEXT_PUBLIC_PICHER_BASE_URL;
  // Fetch images on component mount
  const fetchParticles = async () => {
    try {
      const response = await axios.get(`${API}/Particles/GetAllById/${id}`);
      if (response.status === 200) {
        const { images, title } = response.data;

        // Ensure `images` is an array, or parse if necessary
        const parsedImages = Array.isArray(images)
          ? images
          : JSON.parse(images);

        setImages(parsedImages);
        setTitle(title);
        setLoading(false);
      } else {
        message.error("Failed to fetch particle details");
      }
    } catch (error) {
      console.error("Failed to fetch particle details:", error);
      message.error("Error fetching particle details");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParticles();
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

      // Log the FormData content for debugging
      console.log(
        "Form Data being sent:",
        formData.get("image"),
        formData.get("id")
      );

      try {
        const response = await axios.post(`${API}/Particles/Add`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.status === 200 && response.data.success) {
          console.log("Server response:", response.data);
          // Update the images state with the new image path
          setImages([...images, `${URLFile}${response.data.newImagePath}`]);
          setIsModalVisible(false);
          setNewImageFile(null);
          message.success("Image added successfully");
        } else {
          console.error("Server response error:", response.data);
          message.error(response.data.message || "Failed to add image");
        }
      } catch (error) {
        console.error("Error adding image:", error);
        if (axios.isAxiosError(error) && error.response) {
          console.error("Server responded with:", error.response.data);
          message.error(error.response.data.message || "Error adding image");
        } else {
          message.error("Error adding image");
        }
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
        const response = await axios.put(`${API}/Particles/Edit/${id}`, formData);

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
      const response = await axios.delete(`${API}/Particles/Delete`, {
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

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );
  const ChangButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      {loading ? <LoadingOutlined /> : <RetweetOutlined />}
      <div style={{ marginTop: 8 }}>Change Image</div>
    </button>
  );
  return (
    <DashboardCard title={`${title}`}>
      <div>
        <Row gutter={[16, 16]}>
          {images.map((image, index) => (
            <Col xs={24} sm={12} md={8} lg={6} key={index}>
              <Card
                hoverable
                cover={
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "100%", // Ensures the container takes the full height of the card
                    }}
                  >
                    <Image width={120} src={`${image}`} />
                  </div>
                }
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
                    style={{ fontSize: "40px", padding: 31, color: "#1890ff" }}
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
                  fontFamily: "Mitr",
                  fontSize: "10px",
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
            <div style={{ textAlign: "center" }}>
              <Upload
                name="avatar"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                beforeUpload={() => false}
                onChange={handleUpload}
              >
                {isAddMode ? uploadButton : ChangButton}
              </Upload>
            </div>
          )}
        </Modal>
      </div>
    </DashboardCard>
  );
};

export default PhotoDetailsPage;
