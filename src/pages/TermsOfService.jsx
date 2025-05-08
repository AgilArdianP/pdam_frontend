import React from "react";

const TermsOfService = () => {
  return (
    <div className="flex min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-10">
          {/* Header */}
          <div className="border-b border-gray-200 pb-6 mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-blue-800 mb-2">Syarat & Ketentuan Layanan</h1>
            <p className="text-gray-500 text-sm">PDAM Desa - Sistem Pengelolaan Air</p>
          </div>

          {/* Introduction */}
          <div className="mb-8">
            <p className="text-gray-700 leading-relaxed">
              Selamat datang di aplikasi pengelolaan PDAM Desa. Dokumen ini mengatur hubungan antara pengguna ("Anda") dengan kami sebagai penyedia layanan. 
              Dengan mengakses atau menggunakan aplikasi ini, Anda menyatakan telah membaca, memahami, dan menyetujui untuk terikat oleh syarat dan ketentuan berikut.
            </p>
          </div>

          {/* Sections */}
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-blue-700 mb-3 flex items-center">
                <span className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center mr-2 flex-shrink-0">1</span>
                <span>Layanan</span>
              </h2>
              <div className="pl-10">
                <p className="text-gray-700 leading-relaxed mb-3">
                  Aplikasi ini menyediakan platform pengelolaan data PDAM Desa, termasuk administrasi pelanggan, 
                  pencatatan penggunaan air, penagihan, dan pelaporan. Kami berkomitmen untuk menyediakan layanan 
                  yang akurat, andal, dan sesuai dengan standar industri.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Penggunaan layanan harus mematuhi semua peraturan daerah dan nasional terkait pengelolaan air dan perlindungan data.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-blue-700 mb-3 flex items-center">
                <span className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center mr-2 flex-shrink-0">2</span>
                <span>Penggunaan Data</span>
              </h2>
              <div className="pl-10">
                <p className="text-gray-700 leading-relaxed mb-3">
                  Data yang dikumpulkan melalui aplikasi ini digunakan secara eksklusif untuk tujuan operasional PDAM Desa 
                  dan administrasi pelanggan. Kami menerapkan langkah-langkah keamanan untuk melindungi informasi tersebut.
                </p>
                <p className="text-gray-700 leading-relaxed mb-3">
                  Semua informasi pelanggan diperlakukan dengan kerahasiaan maksimum dan tidak akan dibagikan kepada pihak ketiga 
                  tanpa persetujuan tertulis, kecuali sebagaimana diwajibkan oleh hukum atau otoritas yang berwenang.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Pengguna aplikasi bertanggung jawab untuk memastikan keakuratan data yang dimasukkan dan untuk menggunakan sistem 
                  sesuai dengan protokol keamanan yang ditetapkan.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-blue-700 mb-3 flex items-center">
                <span className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center mr-2 flex-shrink-0">3</span>
                <span>Tanggung Jawab Pengguna</span>
              </h2>
              <div className="pl-10">
                <p className="text-gray-700 leading-relaxed">
                  Pengguna aplikasi dilarang:
                </p>
                <ul className="list-disc pl-5 mt-2 mb-3 space-y-1 text-gray-700">
                  <li>Menyalahgunakan data pelanggan untuk tujuan di luar operasional PDAM</li>
                  <li>Membagikan kredensial akses dengan pihak yang tidak berwenang</li>
                  <li>Melakukan tindakan yang dapat membahayakan keamanan sistem</li>
                  <li>Menggunakan aplikasi dengan cara yang melanggar hukum</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-blue-700 mb-3 flex items-center">
                <span className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center mr-2 flex-shrink-0">4</span>
                <span>Perubahan Ketentuan</span>
              </h2>
              <div className="pl-10">
                <p className="text-gray-700 leading-relaxed">
                  Kami berhak untuk mengubah syarat dan ketentuan ini sesuai kebutuhan. Perubahan signifikan akan 
                  diberitahukan kepada pengguna melalui aplikasi. Dengan melanjutkan penggunaan aplikasi setelah 
                  perubahan tersebut, Anda menyetujui syarat dan ketentuan yang telah direvisi.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-blue-700 mb-3 flex items-center">
                <span className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center mr-2 flex-shrink-0">5</span>
                <span>Dukungan Teknis</span>
              </h2>
              <div className="pl-10">
                <p className="text-gray-700 leading-relaxed">
                  Dukungan teknis tersedia selama jam kerja normal. Pertanyaan dan masalah dapat disampaikan 
                  melalui saluran komunikasi yang disediakan dalam aplikasi. Kami akan berusaha menyelesaikan 
                  masalah teknis dengan tepat waktu sesuai dengan tingkat prioritasnya.
                </p>
              </div>
            </section>
          </div>

          {/* Footer */}
          <div className="mt-12 pt-6 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <p className="text-sm text-gray-600 mb-2 sm:mb-0">
                Terakhir diperbarui: <span className="font-medium">8 Mei 2025</span>
              </p>
              <div className="flex space-x-4">
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">Cetak</button>
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">Unduh PDF</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;