"use client";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { useQuery } from "@tanstack/react-query";
import {
  Calendar,
  CreditCard,
  Heart,
  Stethoscope,
  Phone,
  MapPin,
  Mail,
  Clock as ClockIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function App() {
  return (
    <>
      <div className="min-h-scree">
        <Header />

        <section className="relative h-[500px] pt-24">
          <div className="absolute top-0 right-0 w-full -z-1 bg-gradient-to-b from-green-100 to-gray-50">
            <Image
              src="/home/banner-2.png"
              alt="banner"
              width={1000}
              height={1000}
              className="w-full"
            />
          </div>
          <div className="container mx-auto px-4 flex">
            <div className="max-w-4xl mx-auto text-center relative flex items-center flex-col gap-4">
              <h1 className="text-4xl md:text-5xl font-bold text-green-900 mb-6 z-10 w-full">
                CUIDADOS PRA VIDA
                <br />
                Liderando o Caminho
                <br />
                na Excelência Médica
              </h1>
              <Link
                href="/login"
                className="bg-green-700 hover:bg-green-800 text-white px-8 py-3 rounded-md text-lg font-medium transition mb-12 z-10 w-fit"
              >
                FAZER LOGIN
              </Link>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto pt-8 z-0">
                <div className="bg-green-800 text-white p-6 rounded-lg shadow-lg">
                  <Calendar className="w-10 h-10 mb-4 mx-auto" />
                  <h3 className="text-lg font-semibold mb-2">
                    Escolha seu dia e Horário
                  </h3>
                </div>
                <div className="bg-green-100 text-green-900 p-6 rounded-lg shadow-lg">
                  <Stethoscope className="w-10 h-10 mb-4 mx-auto text-green-700" />
                  <h3 className="text-lg font-semibold mb-2">
                    Escolha seu médico
                  </h3>
                </div>
                <div className="bg-green-100 text-green-900 p-6 rounded-lg shadow-lg">
                  <CreditCard className="w-10 h-10 mb-4 mx-auto text-green-700" />
                  <h3 className="text-lg font-semibold mb-2">
                    Preços acessíveis
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Welcome Section */}
        <section className="pt-32 bg-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-green-900 mb-4">
              BEM-VINDO AO VIRTUAL MED
            </h2>
            <h3 className="text-2xl font-semibold text-gray-800 mb-6">
              Um ótimo lugar para receber cuidados.
            </h3>
            <p className="max-w-3xl mx-auto text-gray-600 mb-8">
              Onde a tecnologia, o conforto e o carinho se unem para cuidar de
              você e da sua saúde.
            </p>
            <button className="text-green-700 font-medium hover:underline">
              Ver mais →
            </button>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-green-900 mb-12">
              CUIDADOS EM QUE VOCÊ PODE ACREDITAR
              <br />
              Nossos Serviços
            </h2>

            <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-6">
                  Uma paixão por colocar os pacientes em primeiro lugar.
                </h3>
                <ul className="space-y-4 text-gray-700">
                  <li className="flex items-start gap-3">
                    <Heart className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                    <span>Uma paixão pela cura</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Heart className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                    <span>Todo o nosso melhor</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Heart className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                    <span>Um legado de excelência</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Heart className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                    <span>Atendimento 5 estrelas</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Heart className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                    <span>Acredite em nós</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Heart className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                    <span>Sempre cuidando</span>
                  </li>
                </ul>
                <p className="mt-8 text-gray-600">
                  Cuidar de pessoas é mais do que a nossa profissão — é a nossa
                  paixão. Cada membro da nossa equipa trabalha com um propósito
                  comum: colocar os pacientes em primeiro lugar. Acreditamos que
                  a excelência em saúde nasce da combinação entre tecnologia,
                  conhecimento e um atendimento humano, compassivo e
                  individualizado.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-64">
                  <Image
                    src="/home/paciente-1.png"
                    alt="ssss"
                    width={200}
                    height={200}
                    className="rounded-xl w-full"
                  />
                </div>
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-64">
                  <Image
                    src="/home/paciente-1.png"
                    alt="ssss"
                    width={200}
                    height={200}
                    className="rounded-xl w-full"
                  />
                </div>
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-64">
                  <Image
                    src="/home/paciente-1.png"
                    alt="ssss"
                    width={200}
                    height={200}
                    className="rounded-xl w-full"
                  />
                </div>
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-64">
                  <Image
                    src="/home/paciente-1.png"
                    alt="ssss"
                    width={200}
                    height={200}
                    className="rounded-xl w-full"
                  />
                </div>
              </div>
            </div>

            {/* Specialties */}
            <h2 className="text-3xl font-bold text-center text-green-900 mb-12">
              SEMPRE CUIDANDO
              <br />
              Nossas especialidades
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
              {[
                "Neurologia",
                "Ossos",
                "Oncologia",
                "Otorrinolaringologia",
                "Oftalmologia",
                "Cardiovascular",
                "Pulmonologia",
                "Medicina Renal",
                "Gastroenterologia",
                "Urologia",
                "Dermatologia",
                "Ginecologia",
              ].map((spec) => (
                <div
                  key={spec}
                  className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-xl transition"
                >
                  <Heart className="w-12 h-12 text-green-700 mx-auto mb-4" />
                  <p className="font-medium text-gray-800">{spec}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Appointment Form */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-green-900 mb-6">
                  MARCAR CONSULTA
                </h2>
                <p className="text-gray-600">
                  Marcar a sua consulta nunca foi tão simples.
                  <br />
                  Escolha o especialista, o dia e a hora que melhor se adaptam à
                  sua rotina. Nossa equipa está pronta para acolher você com
                  atenção, cuidado e profissionalismo desde o primeiro contato.
                </p>
              </div>
              <form className="bg-green-800 text-white p-8 rounded-lg space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <input
                    type="text"
                    placeholder="Nome"
                    className="bg-green-700 px-4 py-3 rounded placeholder-gray-300"
                  />
                  <input
                    type="text"
                    placeholder="Género"
                    className="bg-green-700 px-4 py-3 rounded placeholder-gray-300"
                  />
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
                <Link
                  href="/login"
                  className="w-full bg-green-600 hover:bg-green-500 py-3 px-3 rounded font-semibold transition"
                >
                  SUBMETER
                </Link>
              </form>
            </div>
          </div>
        </section>

        {/* Doctors Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-green-900 mb-12">
              CONFIE EM NOSSOS CUIDADOS
              <br />
              Nossos Doctores
            </h2>
            <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
              {[
                {
                  name: "Antunes Vitta",
                  specialty: "NEUROLOGISTA",
                  avatar: "/home/medico-1.png",
                },
                {
                  name: "Mpanda Mvuela",
                  specialty: "UROLOGISTA",
                  avatar: "/home/medico-2.png",
                },
                {
                  name: "Futi Simão",
                  specialty: "CARDIOLOGISTA",
                  avatar: "/home/medico-3.png",
                },
              ].map((doctor) => (
                <div
                  key={doctor.name}
                  className="bg-white rounded-lg shadow-lg overflow-hidden"
                >
                  <div className="bg-gray-200 border-2 border-dashed rounded-t-lg w-full h-64">
                    <Image
                      src={doctor.avatar}
                      alt="ssss"
                      width={200}
                      height={200}
                      className="rounded-t-lg w-full"
                    />
                  </div>
                  <div className="p-6 bg-green-100">
                    <h3 className="text-xl font-bold text-gray-800">
                      {doctor.name}
                    </h3>
                    <p className="text-green-700 font-medium mb-4">
                      {doctor.specialty}
                    </p>
                    <div className="flex justify-center gap-4 mb-6">
                      <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                      <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                      <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                    </div>
                    <Link
                      href="/login"
                      className="bg-green-800 text-white px-8 py-2 rounded hover:bg-green-900 transition"
                    >
                      Ver Perfil
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div className="bg-white text-green-900 p-6 rounded-lg text-center">
            <Phone className="w-10 h-10 mx-auto mb-3" />
            <p className="font-semibold">EMERGÊNCIA</p>
            <p>(244) 934-652-259</p>
            <p>(244) 934-524-259</p>
          </div>
          <div className="bg-green-800 p-6 rounded-lg text-center">
            <MapPin className="w-10 h-10 mx-auto mb-3 text-white" />
            <p className="font-semibold text-white">LOCALIZAÇÃO</p>
            <p className="text-white">Nova Urbanização</p>
          </div>
          <div className="bg-white text-green-900 p-6 rounded-lg text-center">
            <Mail className="w-10 h-10 mx-auto mb-3" />
            <p className="font-semibold">EMAIL</p>
            <p>medicalweb@gmail.com</p>
          </div>
          <div className="bg-green-800 p-6 rounded-lg text-center">
            <ClockIcon className="w-10 h-10 mx-auto mb-3 text-white" />
            <p className="font-semibold text-white">ABERTO</p>
            <p className="text-white">24 / 24 horas</p>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}
