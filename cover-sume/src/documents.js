import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import Layout from "./Layout";
import { PageIntro } from "./ui";

function Documents() {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth0();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isLoading && user?.sub) {
      fetchUserDocuments(user.sub);
    } else if (!isLoading && !user) {
      setLoading(false);
    }
  }, [user, isLoading]);

  const handleViewOrDownload = async (key, download = false) => {
    try {
      // const response = await fetch(`https://coversume-backend.onrender.com/get-presigned-url?s3Key=${encodeURIComponent(key)}`);
      const response = await fetch(
        `http://localhost:3001/get-presigned-url?s3Key=${encodeURIComponent(key)}`
      );
      const data = await response.json();

      if (download) {
        const a = document.createElement("a");
        a.href = data.url;
        a.download = key.split("/").pop();
        a.click();
      } else {
        window.open(data.url, "_blank");
      }
    } catch (err) {
      console.error("Error getting file URL:", err);
      setError("Failed to access file");
    }
  };

  const fetchUserDocuments = async (userId) => {
    try {
      setLoading(true);
      // const response = await fetch(`https://coversume-backend.onrender.com/user-files?userId=${userId}`);
      const response = await fetch(`http://localhost:3001/user-files?userId=${userId}`);

      if (!response.ok) {
        throw new Error("Failed to fetch documents");
      }

      const data = await response.json();
      setDocuments(data.files || []);
    } catch (err) {
      console.error("Error fetching documents:", err);
      setError("Failed to load documents");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="mx-auto max-w-5xl px-5 py-12 md:py-16">
        <PageIntro kicker="Documents" title="Your files">
          Resumes and cover letters generated on this account.
        </PageIntro>

        {isLoading || (user && loading) ? (
          <p className="text-sm text-[#5e574f]">Loading documents.</p>
        ) : !user ? (
          <p className="text-sm text-[#5e574f]">Log in to see documents saved to your account.</p>
        ) : (
          <>
            {error && <div className="note mb-6 max-w-xl">{error}</div>}

            {documents.length === 0 ? (
              <div className="border border-dashed border-[#d5cec3] bg-[#fffdf9] px-6 py-10">
                <p className="text-sm text-[#5e574f]">Nothing here yet.</p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <button type="button" onClick={() => navigate("/resume")} className="btn">
                    Build a resume
                  </button>
                  <button type="button" onClick={() => navigate("/cover")} className="btn btn-line">
                    Write a cover letter
                  </button>
                </div>
              </div>
            ) : (
              <ul className="border-t border-[#ddd6cb]">
                {documents.map((doc, index) => {
                  const fileName = doc.Key.split("/").pop();
                  const fileType = doc.Key.includes("/resume/") ? "Resume" : "Cover letter";
                  const uploadDate = new Date(doc.LastModified).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  });

                  return (
                    <li
                      key={index}
                      className="flex flex-col gap-3 border-b border-[#ddd6cb] py-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium">{fileType}</p>
                        <p className="mt-0.5 truncate text-sm text-[#5e574f]">
                          {fileName}
                          <span className="text-[#8a8278]">
                            {" "}
                            · {uploadDate} · {(doc.Size / 1024).toFixed(0)} KB
                          </span>
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleViewOrDownload(doc.Key, false)}
                        className="btn btn-line shrink-0"
                      >
                        Open
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}

export default Documents;
