"use client";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";

export default function SobreNos() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      {/* Hero Section - Sobre nós */}
      <section className="relative h-96 md:h-screen max-h-screen overflow-hidden">
        <img
          src="https://img.freepik.com/premium-photo/healthcare-team-portrait-doctors-nurses-standing-corridor-hospital-confidence-diversity-happy-professional-medical-workers-with-smile-collaboration-medicare-clinic_590464-185282.jpg"
          alt="Equipe médica Virtual Med"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-0 left-0 p-8 md:p-16 text-white">
          <p className="text-sm md:text-lg mb-2 opacity-80">Início / Sobre</p>
          <h1 className="text-4xl md:text-6xl font-bold">Sobre nós</h1>
        </div>
      </section>

      {/* Welcome Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <img
              src="https://thumbs.dreamstime.com/b/happy-doctor-together-senior-patient-having-fun-medical-checkup-clinic-smiling-old-woman-friendly-physician-sitting-402214577.jpg"
              alt="Médica e paciente sorrindo"
              className="rounded-lg shadow-xl w-full"
            />
          </div>
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-green-900 mb-6">
              BENVINDO A VIRTUAL MED
              <br />O melhor cuidado para a sua Boa Saúde
            </h2>
            <ul className="grid grid-cols-2 gap-4 mb-8 text-green-700 font-medium">
              <li>• Uma paixão pela cura</li>
              <li>• Atendimento 5 Estrelas</li>
              <li>• Todo o nosso melhor</li>
              <li>• Acredite em nós</li>
              <li>• Sempre cuidando</li>
              <li>• Um legado de excelência</li>
            </ul>
            <p className="text-gray-700 mb-4">
              Com o avanço da tecnologia e a humanização dos serviços, os
              cuidados de saúde tornaram-se mais acessíveis, personalizados e
              centrados no paciente. Cuidar da saúde é investir no futuro —
              porque viver bem é o primeiro passo para viver mais.
            </p>
            <p className="text-gray-700">
              Os cuidados de saúde visam garantir o bem-estar e a qualidade de
              vida por meio da prevenção, diagnóstico, tratamento e
              acompanhamento, promovendo o equilíbrio físico e mental e
              incentivando hábitos saudáveis.
            </p>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="relative h-96 md:h-screen max-h-screen overflow-hidden">
        <img
          src="https://thumbs.dreamstime.com/b/woman-comforts-loved-one-hospital-bed-doctor-shares-important-health-updates-scene-reflects-care-424474346.jpg"
          alt="Médico cuidando de paciente"
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
        {/* Dots for carousel (decorative) */}
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
