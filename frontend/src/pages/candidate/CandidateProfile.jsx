import { useState } from 'react';
import { User, Mail, Camera } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useAuthStore } from '../../store/authStore';
import { useFileUpload } from '../../hooks/useFileUpload';
import { validateImageFile } from '../../utils/validators';
import toast from 'react-hot-toast';

const CandidateProfile = () => {
  const { user, profile } = useAuth();
  const { updateProfile } = useAuthStore();
  const { uploadFile, isUploading } = useFileUpload();
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const errors = validateImageFile(file);
    if (errors.length > 0) {
      toast.error(errors.join(', '));
      return;
    }

    setSelectedImage(file);
  };

  const handleUploadProfilePic = async () => {
    if (!selectedImage) return;

    try {
      await uploadFile(selectedImage, async (base64) => {
        await updateProfile(base64);
      });
      setSelectedImage(null);
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Profile</h1>
        <p className="text-gray-500 mt-1">Manage your profile information</p>
      </div>

      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex items-center gap-6">
            <div className="avatar">
              <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                {profile?.profile_pic ? (
                  <img src={profile.profile_pic} alt="Profile" />
                ) : (
                  <div className="bg-primary text-white flex items-center justify-center">
                    <User className="w-12 h-12" />
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="file-input file-input-bordered file-input-sm w-full max-w-xs"
              />
              {selectedImage && (
                <button
                  onClick={handleUploadProfilePic}
                  className="btn btn-primary btn-sm mt-2"
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <span className="loading loading-spinner"></span>
                  ) : (
                    <>
                      <Camera className="w-4 h-4 mr-2" />
                      Upload Photo
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          <div className="divider"></div>

          <div className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Full Name</span>
              </label>
              <label className="input input-bordered flex items-center gap-2">
                <User className="w-4 h-4 opacity-70" />
                <input
                  type="text"
                  value={profile?.full_name || ''}
                  disabled
                  className="grow"
                />
              </label>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Email</span>
              </label>
              <label className="input input-bordered flex items-center gap-2">
                <Mail className="w-4 h-4 opacity-70" />
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="grow"
                />
              </label>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Account Type</span>
              </label>
              <input
                type="text"
                value="Candidate"
                disabled
                className="input input-bordered capitalize"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateProfile;