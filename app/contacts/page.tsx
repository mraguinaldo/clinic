"use client";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Phone, Clock, MapPin, Mail } from "lucide-react";

export default function Contacto() {
  const news = [
    {
      date: "Segunda 03, Novembro 2025",
      title: "Nesta manhã mais de 25mil partos foram realizados!",
      likes: 68,
      hearts: 86,
    },
    {
      date: "Segunda 03, Novembro 2025",
      title: "Nesta manhã mais de 25mil partos foram realizados!",
      likes: 68,
      hearts: 86,
    },
    {
      date: "Segunda 03, Novembro 2025",
      title: "Nesta manhã mais de 25mil partos foram realizados!",
      likes: 68,
      hearts: 86,
    },
    {
      date: "Segunda 03, Novembro 2025",
      title: "Nesta manhã mais de 25mil partos foram realizados!",
      likes: 68,
      hearts: 86,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      {/* Hero Section - Nossos contactos */}
      <section className="relative h-96 md:h-[70vh] overflow-hidden bg-green-100">
        <div className="absolute inset-0 bg-gradient-to-r from-green-200 via-transparent to-green-200 opacity-60" />
        <img
          src="https://img.freepik.com/free-photo/portrait-smiling-male-doctor_171337-22504.jpg"
          alt="Doutor sorrindo"
          className="w-full h-full object-cover absolute inset-0 mix-blend-overlay"
        />
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="text-green-900">
            <p className="text-lg mb-2 opacity-80">Início / Contacto</p>
            <h1 className="text-5xl md:text-7xl font-bold">Nossos contactos</h1>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="rounded-xl shadow-2xl overflow-hidden">
            <img
              src="https://maps.googleapis.com/maps/api/staticmap?center=Cacuaco,Luanda,Angola&zoom=14&size=1200x500&markers=color:red%7Clabel:V%7CNova+Urbaniza%C3%A7%C3%A3o,Cacuaco,Luanda,Angola&key=YOUR_KEY"
              alt="Localização Virtual Med - Cacuaco, Nova Urbanização"
              className="w-full"
            />
          </div>
        </div>
      </section>

      {/* Contact Form + Info */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-green-900 mb-12">
            ENTRE EM
            <br />
            Contacto
          </h2>

          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto items-start">
            {/* Formulário */}
            <div className="bg-green-800 text-white p-8 md:p-12 rounded-xl shadow-xl">
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <input
                    type="text"
                    placeholder="Nome"
                    className="bg-green-700 px-6 py-4 rounded-lg placeholder-gray-300 focus:outline-none"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    className="bg-green-700 px-6 py-4 rounded-lg placeholder-gray-300 focus:outline-none"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Subject"
                  className="w-full bg-green-700 px-6 py-4 rounded-lg placeholder-gray-300 focus:outline-none"
                />
                <textarea
                  placeholder="Mensagem"
                  rows={6}
                  className="w-full bg-green-700 px-6 py-4 rounded-lg placeholder-gray-300 focus:outline-none resize-none"
                />
                <button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-500 py-4 rounded-lg font-bold text-lg transition"
                >
                  SUBMETER
                </button>
              </form>
            </div>

            {/* Cards de contacto */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="bg-green-100 p-8 rounded-xl text-center">
                <Phone className="w-12 h-12 text-green-800 mx-auto mb-4" />
                <h4 className="font-bold text-green-900 mb-2">EMERGÊNCIA</h4>
                <p className="text-sm">(244) 936-652-210</p>
                <p className="text-sm">(244) 934-574-259</p>
              </div>

              <div className="bg-green-800 text-white p-8 rounded-xl text-center">
                <MapPin className="w-12 h-12 mx-auto mb-4" />
                <h4 className="font-bold mb-2">LOCALIZAÇÃO</h4>
                <p className="text-sm">Cacuaco</p>
                <p className="text-sm">Nova Urbanização</p>
              </div>

              <div className="bg-green-100 p-8 rounded-xl text-center">
                <Mail className="w-12 h-12 text-green-800 mx-auto mb-4" />
                <h4 className="font-bold text-green-900 mb-2">EMAIL</h4>
                <p className="text-sm break-words">medicalweb@gmail.com</p>
              </div>

              <div className="bg-green-100 p-8 rounded-xl text-center">
                <Clock className="w-12 h-12 text-green-800 mx-auto mb-4" />
                <h4 className="font-bold text-green-900 mb-2">ABERTO</h4>
                <p className="text-sm">24 / 24 horas</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Notícias */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-green-900 mb-12">
            MAIS INFORMAÇÕES SOBRE SAÚDE
            <br />
            Notícias
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {news.map((item, i) => (
              <div
                key={i}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition"
              >
                <div className="h-48 bg-gray-200 border-2 border-dashed" />{" "}
                {/* Placeholder para imagem */}
                <div className="p-6">
                  <p className="text-sm text-gray-500 mb-2">{item.date}</p>
                  <h3 className="font-bold text-green-900 mb-4">
                    {item.title}
                  </h3>
                  <div className="flex justify-center gap-6 text-sm text-gray-600">
                    <span>👍 {item.likes}</span>
                    <span>❤️ {item.hearts}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-2 mt-8">
            <div className="w-3 h-3 bg-green-600 rounded-full" />
            <div className="w-3 h-3 bg-gray-400 rounded-full" />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
