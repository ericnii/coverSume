import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

function Documents() {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth0();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isLoading && user?.sub) {
      fetchUserDocuments(user.sub);
    }
  }, [user, isLoading]);

  const handleViewOrDownload = async (key, download = false) => {
    try {
      const response = await fetch(`http://localhost:3001/get-presigned-url?s3Key=${encodeURIComponent(key)}`);
      const data = await response.json();
      
      if (download) {
        // Trigger download
        const a = document.createElement('a');
        a.href = data.url;
        a.download = key.split('/').pop();
        a.click();
      } else {
        // Open in new tab for viewing
        window.open(data.url, '_blank');
      }
    } catch (err) {
      console.error('Error getting file URL:', err);
      setError('Failed to access file');
    }
  };

  const fetchUserDocuments = async (userId) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3001/user-files?userId=${userId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch documents');
      }

      const data = await response.json();
      setDocuments(data.files || []);
    } catch (err) {
      console.error('Error fetching documents:', err);
      setError('Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return <div className="p-8">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="p-8">
        <p>Please log in to view your documents</p>
      </div>
    );
  }

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <button
        onClick={() => navigate('/')}
        className="mb-6 px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
      >
        ← Back Home
      </button>

      <h1 className="text-4xl font-bold mb-4">My Documents</h1>
      <p className="text-gray-600 mb-6">All your generated resumes and cover letters</p>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <p>Loading documents...</p>
        </div>
      ) : documents.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed">
          <p className="text-gray-500 mb-4">No documents yet</p>
          <button
            onClick={() => navigate('/resume')}
            className="px-6 py-2 bg-yellow-400 rounded-3xl hover:opacity-50"
          >
            Create Resume
          </button>
          <span className="mx-2">or</span>
          <button
            onClick={() => navigate('/cover')}
            className="px-6 py-2 bg-yellow-400 rounded-3xl hover:opacity-50"
          >
            Create Cover Letter
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {documents.map((doc, index) => {
            const fileName = doc.Key.split('/').pop();
            const fileType = doc.Key.includes('/resume/') ? 'Resume' : 'Cover Letter';
            const uploadDate = new Date(doc.LastModified).toLocaleDateString();

            return (
              <div key={index} className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500 flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-lg">{fileType}</h3>
                  <p className="text-sm text-gray-600">
                    {fileName} • {uploadDate}
                  </p>
                  <p className="text-xs text-gray-500">
                    Size: {(doc.Size / 1024).toFixed(2)} KB
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleViewOrDownload(doc.Key, false)}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    View and Download
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Documents;
