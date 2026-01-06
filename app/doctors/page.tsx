"use client";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Phone, Clock, MapPin } from "lucide-react";

export default function Doutores() {
  const doctors = [
    { name: "Antunes Vitti", specialty: "NEUROLOGISTA" },
    { name: "Mpanda Myele", specialty: "UROLOGISTA" },
    { name: "Futi Simão", specialty: "CARDIOLOGISTA" },
    { name: "Antunes Vitti", specialty: "NEUROLOGISTA" },
    { name: "Mpanda Myele", specialty: "UROLOGISTA" },
    { name: "Futi Simão", specialty: "CARDIOLOGISTA" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      {/* Hero Section - Nossos Doutores */}
      <section className="relative h-96 md:h-[70vh] overflow-hidden">
        <img
          src="https://img.freepik.com/free-photo/team-doctors-standing-together-healthcare-medicine-concept_53419-6788.jpg"
          alt="Equipe de doutores Virtual Med"
          className="w-full h-full object-cover brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 p-8 md:p-16 text-white">
          <p className="text-sm md:text-lg mb-2 opacity-80">
            Início / Doutores
          </p>
          <h1 className="text-4xl md:text-6xl font-bold">Nossos Doutores</h1>
        </div>
      </section>

      {/* Doctors Grid */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            {doctors.map((doctor, index) => (
              <div
                key={`${doctor.name}-${index}`}
                className="bg-white rounded-lg shadow-xl overflow-hidden hover:shadow-2xl transition"
              >
                <div className="h-80 overflow-hidden">
                  <img
                    src={`https://randomuser.me/api/portraits/men/${
                      index + 40
                    }.jpg`}
                    alt={doctor.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="bg-green-100 p-6 text-center">
                  <h3 className="text-2xl font-bold text-green-900 mb-1">
                    {doctor.name}
                  </h3>
                  <p className="text-green-700 font-semibold mb-4">
                    {doctor.specialty}
                  </p>
                  <div className="flex justify-center gap-4 mb-6">
                    <div className="w-8 h-8 bg-green-700 rounded-full flex items-center justify-center text-white text-sm">
                      in
                    </div>
                    <div className="w-8 h-8 bg-green-700 rounded-full flex items-center justify-center text-white text-sm">
                      f
                    </div>
                    <div className="w-8 h-8 bg-green-700 rounded-full flex items-center justify-center text-white text-sm">
                      @
                    </div>
                  </div>
                  <button className="bg-green-800 hover:bg-green-900 text-white px-12 py-3 rounded-md font-medium transition">
                    Ver Perfil
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="relative h-96 md:h-[70vh] overflow-hidden">
        <img
          src="https://thumbs.dreamstime.com/b/woman-comforts-loved-one-hospital-bed-doctor-shares-important-health-updates-scene-reflects-care-424474346.jpg"
          alt="Cuidado médico"
          className="w-full h-full object-cover brightness-50"
        />
        <div className="absolute inset-0 flex items-center justify-center text-center text-white px-8">
          <div>
            <p className="text-2xl md:text-4xl font-light italic mb-8 max-w-4xl">
              A medicina é a arte de curar às vezes, aliviar frequentemente e
              confortar sempre.
            </p>
            <div className="w-32 h-px bg-white mx-auto mb-4" />
            <p className="text-xl md:text-2xl font-semibold">
              Hipócrates de Cós
            </p>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
          <div className="w-3 h-3 bg-white rounded-full opacity-60" />
          <div className="w-3 h-3 bg-white rounded-full" />
          <div className="w-3 h-3 bg-white rounded-full opacity-60" />
        </div>
      </section>

      <Footer />
    </div>
  );
}
