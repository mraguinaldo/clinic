"use client";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Phone, Clock, MapPin, Mail, Calendar } from "lucide-react";

export default function Consultas() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      {/* Hero Section - Livro de Consultas */}
      <section className="relative h-96 md:h-[70vh] overflow-hidden bg-green-100">
        <div className="absolute inset-0 bg-gradient-to-r from-green-200 via-transparent to-green-200 opacity-60" />
        <img
          src="https://img.freepik.com/free-photo/smiling-doctor-with-stethoscope_171337-22504.jpg"
          alt="Doutor sorrindo"
          className="w-full h-full object-cover absolute inset-0 mix-blend-overlay"
        />
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="text-green-900">
            <p className="text-lg mb-2 opacity-80">Home / Consulta</p>
            <h1 className="text-5xl md:text-7xl font-bold">
              Livro de consultas
            </h1>
          </div>
        </div>
      </section>

      {/* Booking Form Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Form */}
            <div>
              <h2 className="text-3xl font-bold text-green-900 mb-6">
                Marcar consulta
              </h2>
              <p className="text-gray-700 mb-8">
                Marcar a sua consulta nunca foi tão simples. Escolha o
                especialista, o dia e o horário que melhor se adaptam à sua
                rotina. Nossa equipa está pronta para acolher você com atenção,
                cuidado e profissionalismo desde o primeiro contato.
              </p>
              <form className="bg-green-800 text-white p-8 rounded-lg space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input
                    type="text"
                    placeholder="Nome"
                    className="bg-green-700 px-4 py-3 rounded placeholder-gray-300"
                  />
                  <select className="bg-green-700 px-4 py-3 rounded">
                    <option>Género</option>
                    <option>Masculino</option>
                    <option>Feminino</option>
                  </select>
                  <input
                    type="email"
                    placeholder="Email"
                    className="bg-green-700 px-4 py-3 rounded placeholder-gray-300"
                  />
                  <input
                    type="tel"
                    placeholder="Telefone"
                    className="bg-green-700 px-4 py-3 rounded placeholder-gray-300"
                  />
                  <input
                    type="date"
                    className="bg-green-700 px-4 py-3 rounded"
                  />
                  <input
                    type="time"
                    className="bg-green-700 px-4 py-3 rounded"
                  />
                  <select className="bg-green-700 px-4 py-3 rounded">
                    <option>Doctor</option>
                  </select>
                  <select className="bg-green-700 px-4 py-3 rounded">
                    <option>Departamento</option>
                  </select>
                </div>
                <textarea
                  placeholder="Mensagem"
                  rows={4}
                  className="w-full bg-green-700 px-4 py-3 rounded placeholder-gray-300"
                ></textarea>
                <button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-500 py-3 rounded font-semibold transition"
                >
                  SUBMETER
                </button>
              </form>
            </div>

            {/* Horários */}
            <div className="bg-green-800 text-white p-8 rounded-lg">
              <h2 className="text-2xl font-bold mb-6">Horários para agendar</h2>
              <ul className="space-y-4">
                {[
                  "Segunda — 09:00 AM - 07:00 PM",
                  "Terça — 09:00 AM - 07:00 PM",
                  "Quarta — 09:00 AM - 07:00 PM",
                  "Quinta — 09:00 AM - 07:00 PM",
                  "Sexta — 09:00 AM - 07:00 PM",
                  "Sábado — 09:00 AM - 07:00 PM",
                  "Domingo — Fechado",
                ].map((horario, i) => (
                  <li
                    key={i}
                    className="flex justify-between border-b border-green-700 pb-2"
                  >
                    <span>{horario.split("—")[0].trim()}</span>
                    <span>{horario.split("—")[1]?.trim()}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 text-center">
                <p className="font-bold mb-2">Emergência</p>
                <div className="flex items-center justify-center gap-2">
                  <Phone className="w-5 h-5" />
                  <span>(244) 934 574 259</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-0">
        <img
          src="https://maps.googleapis.com/maps/api/staticmap?center=Cacuaco,Luanda,Angola&zoom=14&size=1200x400&markers=color:red%7Clabel:H%7CNova+Urbaniza%C3%A7%C3%A3o,Cacuaco&key=NO_KEY_NEEDED_FOR_STATIC_PREVIEW"
          alt="Mapa localização Virtual Med"
          className="w-full h-96 object-cover"
        />
      </section>

      {/* Contact Info */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-green-900 mb-12">
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
