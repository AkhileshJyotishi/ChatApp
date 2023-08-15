'use client'
import React, { useCallback, useEffect, useState } from "react"
import { useDropzone } from "react-dropzone";
import axios from "axios";

export default function Profile() {

    const [loading, setLoading] = useState(false);

    const handleImageSubmit = async (selectedImage: any) => {
        const formData = new FormData();
        formData.append('profile', selectedImage);
        setImageChoosed(selectedImage);

        try {
            setLoading(true);
            // const response = await axios.post(`${BASE_URL}/helpdesk/ProfilePicture`, formData, {
            //     headers: {
            //         'Content-Type': 'multipart/form-data',
            //         Authorization: `Bearer ${user.token}`
            //     },
            // });

            // console.log("Image uploaded successfully", response.data);
        } catch (error) {
            console.error('Error uploading image:', error);
        }
        setLoading(false);
        setImageChoosed(null);
    }


    const [imageChoosed, setImageChoosed] = useState<any>(null);

    const onDrop = useCallback((acceptedFiles: any) => {
        handleImageSubmit(acceptedFiles[0]);
    }, [])


    console.log("Image choosed", imageChoosed);
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })
    let lableStyles = {};
    if (imageChoosed !== null) {
        lableStyles = {
            pointerEvents: 'none',
            cursor: "default",
            opacity: '0.6'
        }
    }

    return (
        <div>
            <div {...getRootProps()} className="flex items-center justify-center w-full">
                <label
                    className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"

                    style={lableStyles}
                >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg
                            className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 20 16"
                        >
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                            />
                        </svg>
                        {imageChoosed != null ?

                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                {imageChoosed.path}
                            </p>
                            :

                            <>
                                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                    <span className="font-semibold">Click to upload</span> or drag and drop
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    SVG, PNG, JPG or GIF (MAX. 800x400px)
                                </p>
                            </>}
                    </div>
                </label>
            </div>
        </div>
    )
}
