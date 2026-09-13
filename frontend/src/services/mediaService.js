import api from './api';

export const fetchMediaFiles = async () => {
  const response = await api.get('/media-files/');
  return response.data;
};

export const uploadMediaFile = async (fileData) => {
  const response = await api.post('/upload-media/', fileData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};
