import React, { useState, useEffect } from 'react';
import { STAFF_LIST } from '../constants';
import { VisitorEntry } from '../types';
import SignaturePad from './SignaturePad';
import { convertFileToBase64, mockUploadToDrive, saveEntry } from '../services/storageService';
import { Save, Loader2, UploadCloud, CheckCircle, FileImage } from 'lucide-react';

interface GuestFormProps {
  onSuccess: () => void;
  editData?: VisitorEntry | null;
}

const GuestForm: React.FC<GuestFormProps> = ({ onSuccess, editData }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<VisitorEntry>>({
    visitorCount: 1,
    date: new Date().toISOString().split('T')[0],
  });
  
  const [signature, setSignature] = useState<string>('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'done'>('idle');

  useEffect(() => {
    if (editData) {
      setFormData(editData);
      setSignature(editData.signatureData);
      setUploadStatus(editData.driveFileId ? 'done' : 'idle');
    }
  }, [editData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhotoFile(e.target.files[0]);
      setUploadStatus('idle'); // Reset status if file changes
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signature) {
      alert("Mohon isi tanda tangan.");
      return;
    }
    if (!formData.name || !formData.receivedBy || !formData.purpose) {
      alert("Mohon lengkapi data formulir.");
      return;
    }

    setLoading(true);

    try {
      let photoUrl = formData.photoUrl;
      let driveId = formData.driveFileId;

      // Simulate Upload Process
      if (photoFile && uploadStatus !== 'done') {
        setUploadStatus('uploading');
        // 1. Convert for local display
        photoUrl = await convertFileToBase64(photoFile);
        // 2. Mock upload to Google Drive
        driveId = await mockUploadToDrive(photoFile);
        setUploadStatus('done');
      }

      const entry: VisitorEntry = {
        id: editData?.id || crypto.randomUUID(),
        date: formData.date!,
        timestamp: Date.now(),
        name: formData.name!,
        visitorCount: Number(formData.visitorCount),
        occupation: formData.occupation || 'Umum',
        purpose: formData.purpose!,
        receivedBy: formData.receivedBy!,
        signatureData: signature,
        photoUrl: photoUrl,
        driveFileId: driveId,
      };

      saveEntry(entry);
      onSuccess();
    } catch (error) {
      console.error(error);
      alert("Gagal menyimpan data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        {editData ? 'Edit Data Kunjungan' : 'Formulir Tamu Baru'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 1. Hari & Tgl */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Hari & Tanggal</label>
            <input
              type="date"
              name="date"
              required
              value={formData.date}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          {/* 6. Diterima Oleh */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Diterima Oleh</label>
            <select
              name="receivedBy"
              required
              value={formData.receivedBy || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="">-- Pilih Petugas --</option>
              {STAFF_LIST.map(staff => (
                <option key={staff} value={staff}>{staff}</option>
              ))}
            </select>
          </div>

          {/* 2. Nama */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">Nama Lengkap</label>
            <input
              type="text"
              name="name"
              required
              placeholder="Masukkan nama lengkap pengunjung"
              value={formData.name || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          {/* 3. Jumlah Pengunjung */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Jumlah Pengunjung</label>
            <input
              type="number"
              min="1"
              name="visitorCount"
              required
              value={formData.visitorCount}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          {/* 4. Pekerjaan */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Pekerjaan</label>
            <input
              type="text"
              name="occupation"
              placeholder="Contoh: PNS, Swasta, Mahasiswa"
              value={formData.occupation || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          {/* 5. Keperluan */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">Keperluan</label>
            <textarea
              name="purpose"
              required
              rows={3}
              placeholder="Jelaskan tujuan kunjungan..."
              value={formData.purpose || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
            />
          </div>

          {/* Upload Foto */}
           <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Upload Foto / Identitas (Simpan ke Google Drive)
            </label>
            <div className="flex items-center gap-4">
                <div className="relative flex-1">
                    <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full text-sm text-slate-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100 cursor-pointer"
                    />
                </div>
                {uploadStatus === 'uploading' && <span className="text-sm text-blue-600 animate-pulse">Uploading...</span>}
                {uploadStatus === 'done' && <span className="text-sm text-green-600 flex items-center gap-1"><CheckCircle size={16}/> Tersimpan di Drive</span>}
            </div>
            {formData.driveFileId && (
                <p className="text-xs text-slate-400 mt-1">Drive ID: {formData.driveFileId}</p>
            )}
          </div>

          {/* 7. Tanda Tangan */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">Tanda Tangan</label>
            <SignaturePad onEnd={setSignature} initialData={signature} />
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="animate-spin h-5 w-5" />
            ) : (
              <Save className="h-5 w-5" />
            )}
            {editData ? 'Simpan Perubahan' : 'Simpan Data'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default GuestForm;