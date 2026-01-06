"use client";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Phone, Clock, MapPin, Stethoscope, Mail } from "lucide-react";

export default function Servicos() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />
      {/* Hero Section - Nossos Serviços */}
      <section className="relative h-96 md:h-[70vh] overflow-hidden">
        <img
          src="https://media.gettyimages.com/id/103922973/photo/doctor-performing-medical-exam-on-patient.jpg?s=1024x1024&w=gi&k=20&c=BLE4AG2bHs4MVoyCp2h6RCrH2i3o7f99xjs8m6ZUiHw="
          alt="Médico examinando paciente"
          className="w-full h-full object-cover brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 p-8 md:p-16 text-white">
          <p className="text-sm md:text-lg mb-2 opacity-80">
            Início / Serviços
          </p>
          <h1 className="text-4xl md:text-6xl font-bold">NOSSOS SERVIÇOS</h1>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Serviço 1 - Checkup Gratuito (destaque maior) */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
              <div className="relative h-64">
                <img
                  src="https://meridianhealthcare.net/wp-content/uploads/2024/06/primary-care-doctor-performing-a-preventative-health-screening-for-a-new-patient.jpg"
                  alt="Checkup Gratuito"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-4 right-4 bg-green-700 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-lg">
                  <Stethoscope className="w-8 h-8" />
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-green-900 mb-3">
                  Checkup Gratuito
                </h3>
                <p className="text-gray-700 mb-4">
                  Fazer um check-up regularmente ajuda a manter o equilíbrio
                  físico e mental, além de promover hábitos saudáveis e
                  qualidade de vida.
                </p>
                <a
                  href="#"
                  className="text-green-700 font-medium hover:underline flex items-center gap-2"
                >
                  Ver mais →
                </a>
              </div>
            </div>

            {/* Outros serviços (repetidos 5 vezes) */}
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition"
              >
                <div className="relative h-64">
                  <img
                    src="https://static.vecteezy.com/system/resources/previews/011/556/041/large_2x/doctor-doing-medical-checkup-for-adult-patient-at-hospital-room-free-photo.jpg"
                    alt="Checkup Gratuito"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-4 right-4 bg-green-700 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-lg">
                    <Stethoscope className="w-8 h-8" />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-green-900 mb-3">
                    Checkup Gratuito
                  </h3>
                  <p className="text-gray-700 mb-4">
                    Fazer um check-up regularmente ajuda a manter o equilíbrio
                    físico e mental, além de promover hábitos saudáveis e
                    qualidade de vida.
                  </p>
                  <a
                    href="#"
                    className="text-green-700 font-medium hover:underline flex items-center gap-2"
                  >
                    Ver mais →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-green-900 mb-12">
            ENTRE EM
            <br />
            Contacto
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            <div className="bg-green-100 p-8 rounded-lg">
              <Phone className="w-12 h-12 text-green-800 mx-auto mb-4" />
              <h4 className="font-bold text-green-900 mb-2">EMERGÊNCIA</h4>
              <p className="text-sm">(244) 936-652-210</p>
              <p className="text-sm">(244) 934-574-259</p>
            </div>
            <div className="bg-green-800 text-white p-8 rounded-lg">
              <MapPin className="w-12 h-12 mx-auto mb-4" />
              <h4 className="font-bold mb-2">LOCALIZAÇÃO</h4>
              <p className="text-sm">Cacuaco</p>
              <p className="text-sm">Nova Urbanização</p>
            </div>
            <div className="bg-green-100 p-8 rounded-lg">
              <Mail className="w-12 h-12 text-green-800 mx-auto mb-4" />
              <h4 className="font-bold text-green-900 mb-2">EMAIL</h4>
              <p className="text-sm">medicalweb@gmail.com</p>
            </div>
            <div className="bg-green-100 p-8 rounded-lg">
              <Clock className="w-12 h-12 text-green-800 mx-auto mb-4" />
              <h4 className="font-bold text-green-900 mb-2">ABERTO</h4>
              <p className="text-sm">24 / 24 horas</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
