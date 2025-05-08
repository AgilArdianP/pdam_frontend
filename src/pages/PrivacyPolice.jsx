import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="flex min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-10">
          {/* Header */}
          <div className="border-b border-gray-200 pb-6 mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-blue-800 mb-2">Kebijakan Privasi</h1>
            <p className="text-gray-500 text-sm">PDAM Desa - Sistem Pengelolaan Air</p>
          </div>

          {/* Introduction */}
          <div className="mb-8">
            <p className="text-gray-700 leading-relaxed">
              Kami di PDAM Desa berkomitmen untuk melindungi dan menghormati privasi Anda. Kebijakan privasi ini menjelaskan 
              praktik kami terkait pengumpulan, penggunaan, penyimpanan, dan perlindungan data pribadi yang Anda berikan 
              saat menggunakan aplikasi pengelolaan PDAM Desa kami.
            </p>
          </div>

          {/* Sections */}
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-blue-700 mb-3 flex items-center">
                <span className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center mr-2 flex-shrink-0">1</span>
                <span>Informasi yang Kami Kumpulkan</span>
              </h2>
              <div className="pl-10">
                <p className="text-gray-700 leading-relaxed mb-3">
                  Aplikasi kami mengumpulkan beberapa jenis informasi untuk menjalankan fungsinya dengan efektif:
                </p>
                <ul className="list-disc pl-5 mt-2 mb-3 space-y-1 text-gray-700">
                  <li>Data identitas pribadi (nama, alamat, nomor telepon)</li>
                  <li>Informasi penggunaan air dan pembayaran</li>
                  <li>Data teknis terkait perangkat dan koneksi yang digunakan</li>
                  <li>Log aktivitas penggunaan aplikasi</li>
                </ul>
                <p className="text-gray-700 leading-relaxed">
                  Semua informasi yang Anda berikan langsung maupun yang dikumpulkan secara otomatis melalui 
                  penggunaan aplikasi akan dijaga kerahasiaannya dengan standar keamanan tinggi.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-blue-700 mb-3 flex items-center">
                <span className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center mr-2 flex-shrink-0">2</span>
                <span>Penggunaan Informasi</span>
              </h2>
              <div className="pl-10">
                <p className="text-gray-700 leading-relaxed mb-3">
                  Informasi yang kami kumpulkan digunakan untuk:
                </p>
                <ul className="list-disc pl-5 mt-2 mb-3 space-y-1 text-gray-700">
                  <li>Mengelola akun pelanggan dan layanan air</li>
                  <li>Memproses pembayaran dan penagihan</li>
                  <li>Mengirimkan pemberitahuan penting terkait layanan</li>
                  <li>Meningkatkan kualitas dan fitur aplikasi</li>
                  <li>Menganalisis tren penggunaan untuk pengambilan keputusan operasional</li>
                </ul>
                <p className="text-gray-700 leading-relaxed">
                  Kami tidak akan menjual, menyewakan, atau menukar data pribadi Anda dengan pihak ketiga untuk 
                  tujuan pemasaran. Informasi hanya akan dibagikan jika diperlukan untuk operasional 
                  layanan atau jika diwajibkan oleh hukum dan otoritas berwenang.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-blue-700 mb-3 flex items-center">
                <span className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center mr-2 flex-shrink-0">3</span>
                <span>Keamanan Data</span>
              </h2>
              <div className="pl-10">
                <p className="text-gray-700 leading-relaxed mb-3">
                  Kami mengimplementasikan serangkaian langkah pengamanan untuk melindungi informasi pribadi Anda:
                </p>
                <ul className="list-disc pl-5 mt-2 mb-3 space-y-1 text-gray-700">
                  <li>Enkripsi data sensitif menggunakan teknologi standar industri</li>
                  <li>Akses terbatas hanya untuk personel yang berwenang</li>
                  <li>Pembaruan keamanan sistem secara berkala</li>
                  <li>Audit keamanan untuk mengidentifikasi potensi kerentanan</li>
                </ul>
                <p className="text-gray-700 leading-relaxed">
                  Meskipun kami berupaya maksimal dalam menjaga keamanan data, tidak ada sistem yang dapat 
                  menjamin keamanan 100%. Kami terus meningkatkan langkah-langkah keamanan sesuai 
                  dengan perkembangan teknologi.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-blue-700 mb-3 flex items-center">
                <span className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center mr-2 flex-shrink-0">4</span>
                <span>Hak Pengguna</span>
              </h2>
              <div className="pl-10">
                <p className="text-gray-700 leading-relaxed mb-3">
                  Sebagai pengguna aplikasi, Anda memiliki hak untuk:
                </p>
                <ul className="list-disc pl-5 mt-2 mb-3 space-y-1 text-gray-700">
                  <li>Mengakses data pribadi yang kami simpan tentang Anda</li>
                  <li>Meminta koreksi informasi yang tidak akurat</li>
                  <li>Membatasi penggunaan data dalam kondisi tertentu</li>
                  <li>Mendapatkan salinan data Anda dalam format yang dapat dibaca mesin</li>
                </ul>
                <p className="text-gray-700 leading-relaxed">
                  Untuk mengajukan permintaan terkait hak Anda, silakan hubungi administrator sistem 
                  melalui kontak yang tersedia di aplikasi.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-blue-700 mb-3 flex items-center">
                <span className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center mr-2 flex-shrink-0">5</span>
                <span>Perubahan Kebijakan</span>
              </h2>
              <div className="pl-10">
                <p className="text-gray-700 leading-relaxed">
                  Kebijakan privasi ini dapat diperbarui sewaktu-waktu untuk mencerminkan perubahan 
                  dalam praktik kami atau persyaratan hukum. Perubahan signifikan akan diinformasikan 
                  melalui aplikasi. Kami mendorong Anda untuk secara berkala memeriksa halaman ini 
                  untuk mendapatkan informasi terbaru mengenai praktik privasi kami.
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

export default PrivacyPolicy;