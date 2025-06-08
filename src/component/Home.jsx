import { useEffect, useState, useRef } from 'react'
import Button from '@mui/material/Button';
import { TypeAnimation } from 'react-type-animation';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { CgProfile } from "react-icons/cg";
import { IoIosMusicalNote } from "react-icons/io";
import { BsPeopleFill } from "react-icons/bs";
import { FaAlignLeft } from "react-icons/fa";

import { FaArrowRight } from "react-icons/fa";
import { IoPersonAddOutline } from "react-icons/io5";
import { AiOutlineStock } from "react-icons/ai";
import { IoMdCloudDone } from "react-icons/io";
import Image1 from '../images/image1.png';
import Image2 from '../images/image2.png';
import Image3 from '../images/image3.png';
import Image4 from '../images/image4.png';
import Image5 from '../images/image5.png';
import Image6 from '../images/image6.png';
import Image7 from '../images/image7.png';
import AOS from 'aos';
import 'aos/dist/aos.css';
import "../index.css"
import { Link } from 'react-router-dom';

// Add this component at the top level of your file
const GradientAnimationStyle = () => (
  <style>
    {`
      .pure-gradient-bg {
        background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
        background-size: 400% 400%;
        animation: gradient 15s ease infinite;
      }
      @keyframes gradient {
        0% {
          background-position: 0% 50%;
        }
        50% {
          background-position: 100% 50%;
        }
        100% {
          background-position: 0% 50%;
        }
      }
      .particles-bg-canvas {
        position: fixed;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: 0;
        top: 0;
        pointer-events: none;
      }
      .particles-bg-wrapper {
        position: absolute;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: 0;
        top: 0;
        pointer-events: none;
      }
      /* Rotating Cube Styles */
      .cube {
        height: 20rem;
        width: 20rem;
        perspective: 60rem;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .cube__container {
        animation: rotationBox 60s linear infinite forwards;
        height: 100%;
        position: relative;
        transform-style: preserve-3d;
        width: 100%;
      }
      .cube__face {
        align-items: center;
        background-color: #222;
        display: flex;
        height: 20rem;
        justify-content: center;
        overflow: hidden;
        position: absolute;
        width: 20rem;
       
        box-shadow: 0 2px 16px #0004;
      }
      .cube__face img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center;
        display: block;
      }
      .cube__face--front  { transform: rotateY(0deg) translateZ(10rem);}
      .cube__face--back   { transform: rotateY(180deg) translateZ(10rem);}
      .cube__face--left   { transform: rotateY(-90deg) translateZ(10rem);}
      .cube__face--right  { transform: rotateY(90deg) translateZ(10rem);}
      .cube__face--top    { transform: rotateX(90deg) translateZ(10rem);}
      .cube__face--bottom { transform: rotateX(-90deg) translateZ(10rem);}
      @keyframes rotationBox {
        0%   { transform: rotate3d(0, 0, 0, 0deg);}
        25%  { transform: rotate3d(0, 1, 1, 90deg);}
        50%  { transform: rotate3d(1, 0, 1, 180deg);}
        75%  { transform: rotate3d(1, 1, 0, 240deg);}
        100% { transform: rotate3d(1, 1, 1, 360deg);}
      }
      @media only screen and (max-width: 900px) {
        .cube, .cube__face {
          width: 12rem;
          height: 12rem;
        }
        .cube__face--front  { transform: rotateY(0deg) translateZ(6rem);}
        .cube__face--back   { transform: rotateY(180deg) translateZ(6rem);}
        .cube__face--left   { transform: rotateY(-90deg) translateZ(6rem);}
        .cube__face--right  { transform: rotateY(90deg) translateZ(6rem);}
        .cube__face--top    { transform: rotateX(90deg) translateZ(6rem);}
        .cube__face--bottom { transform: rotateX(-90deg) translateZ(6rem);}
      }
      @media only screen and (max-width: 640px) {
        .cube, .cube__face {
          width: 7.5rem;
          height: 7.5rem;
        }
        .cube__face--front  { transform: rotateY(0deg) translateZ(3.75rem);}
        .cube__face--back   { transform: rotateY(180deg) translateZ(3.75rem);}
        .cube__face--left   { transform: rotateY(-90deg) translateZ(3.75rem);}
        .cube__face--right  { transform: rotateY(90deg) translateZ(3.75rem);}
        .cube__face--top    { transform: rotateX(90deg) translateZ(3.75rem);}
        .cube__face--bottom { transform: rotateX(-90deg) translateZ(3.75rem);}
      }
    `}
  </style>
);

const teal = "#95e8c7";
const purple = "rgb(96, 165, 250)";
const black = "#181818";

// Particle background component (starts below section 1)
const ParticlesBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Variables
    const particles = [];
    const numParticles = 100;
    const maxDistance = 120;

    // Mouse position
    const mouse = { x: null, y: null };

    // Crear partículas
    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        radius: Math.random() * 2 + 1,
        color: `hsl(${Math.random() * 360}, 70%, 70%)`
      });
    }

    // Dibujar partículas
    function drawParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      });

      connectParticles();
    }

    // Conectar partículas cercanas
    function connectParticles() {
      for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < maxDistance) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(255, 255, 255, ${1 - distance / maxDistance})`;
            ctx.lineWidth = 1;
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }
    }

    // Actualizar partículas
    function updateParticles() {
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        // Atracción al mouse
        if (mouse.x && mouse.y) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            p.vx += dx / 1000;
            p.vy += dy / 1000;
          }
        }
      });
    }

    // Loop principal
    let animationId;
    function animate() {
      drawParticles();
      updateParticles();
      animationId = requestAnimationFrame(animate);
    }
    animate();

    // Mouse movimiento
    function mouseMoveHandler(e) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    }
    function mouseLeaveHandler() {
      mouse.x = null;
      mouse.y = null;
    }
    canvas.addEventListener('mousemove', mouseMoveHandler);
    canvas.addEventListener('mouseleave', mouseLeaveHandler);

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('mousemove', mouseMoveHandler);
      canvas.removeEventListener('mouseleave', mouseLeaveHandler);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className="particles-bg-wrapper" style={{top: 0}}>
      <canvas ref={canvasRef} className="particles-bg-canvas" />
    </div>
  );
};

// RotatingCube component
const RotatingCube = ({ images }) => (
  <div className="cube">
    <div className="cube__container  ">
      <div className="cube__face cube__face--front  bg-black">
        <img src={images[0]} alt="cube-front " className='' />
      </div>
      <div className="cube__face cube__face--back  bg-black">
        <img src={images[1] || images[0]} alt="cube-back"  className='' />
      </div>
      <div className="cube__face cube__face--right  bg-black">
        <img src={images[2] || images[0]} alt="cube-right"  className='' />
      </div>
      <div className="cube__face cube__face--left  bg-black">
        <img src={images[3] || images[0]} alt="cube-left "  className='' />
      </div>
      <div className="cube__face cube__face--top  bg-black">
        <img src={images[4] || images[0]} alt="cube-top"  className='' />
      </div>
      <div className="cube__face cube__face--bottom  bg-black">
        <img src={images[5] || images[0]} alt="cube-bottom"  className='' />
      </div>
    </div>
  </div>
);

const Home = () => {
  const images = ["https://www.shutterstock.com/image-photo/handsome-confident-businessman-wearing-suit-600nw-1417281476.jpg", "https://img.freepik.com/premium-photo/adult-male-businessman-with-stubble-classic-suit-black-background_518914-10.jpg", "https://static.vecteezy.com/system/resources/thumbnails/048/823/246/small_2x/elegant-man-in-black-suit-posing-confidently-against-dark-background-at-nighttime-photo.jpeg", "https://static.vecteezy.com/system/resources/thumbnails/035/348/100/small_2x/ai-generated-a-man-is-in-a-suit-and-tie-dark-white-and-dark-black-free-photo.jpg", "https://thumbs.dreamstime.com/b/fashion-man-buttoning-his-suit-black-background-portrait-young-studio-44048894.jpg", "https://thumbs.dreamstime.com/b/young-businessman-standing-black-background-handsome-man-suit-tie-fashion-portrait-71560442.jpg", Image7];

  const features = [
{
icon: <CgProfile size={28} />,
title: 'AI Lead Discovery',
subtitle: ' Smart Prospecting',
content: 'Find your ideal leads instantly. Our AI scans LinkedIn, websites, and databases to identify key decision-makers with precision.',
},
{
icon: <IoIosMusicalNote size={28} />,
title: 'Lead Enrichment',
subtitle: ' Complete Lead Profiles',
content: 'Automatically enrich every contact with verified emails, phone numbers, company data, and social links — all in one click.',
},
{
icon: <BsPeopleFill size={28} />,
title: 'Automated Outreach',
subtitle: 'AI-Powered Emails',
content: 'Generate high-converting cold emails and follow-ups tailored to each lead’s role, company, and intent — instantly.',
},
{
icon: <FaAlignLeft size={28} />,
title: 'Real-Time Dashboard',
subtitle: 'Performance Insights',
content: 'Monitor campaign results, lead activity, and open rates in real-time with a clean, intuitive dashboard built for conversions.',
},
];


  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  // Gold color for text
  const gold = "#FFD700";
  // Black for background
  const black = "#111";

  return (
    <>
      <GradientAnimationStyle />
      <section className="max-w-full h-screen flex flex-col sm:flex-row pure-gradient-bg" style={{position: "relative", zIndex: 1}}>
        <div className="h-full w-full flex items-center justify-center">
          <div className="w-4/5 h-3/4 lg:h-3/6" data-aos="fade">
            <h1 className="text-3xl font-bold h-32 text-shadow-lg sm:min-h-1/6" style={{color: "white"}}>
                 <TypeAnimation
                sequence={[
                  'Automate Outreach. Personalize Every Message.',
                  1500,
                  'Find Leads. Build Connections. Grow Faster.',
                  1500,
                  'Smarter Prospecting Starts Here.',
                  1500,
                  'Reach Interested Students Faster.',
                  1500,
                ]}
                wrapper="span"
                speed={50}
                style={{ display: 'inline-block' }}
                repeat={Infinity}
              />
            </h1>

            <p className="my-3  md:text-2xl text-shadow-lg" style={{color: "white"}}>
             LeadSpark helps you reach ideal customers while keeping it personal.
            </p>

            <div className="flex md:text-xl   text-black space-x-4">
             
                
          <a
  href="/login?mode=signin"
  class="inline-flex items-center justify-center px-6 py-2 rounded-full border-2 border-black text-black font-semibold bg-[#ccccff]  transition no-underline"
>
  Get started
</a>  
            </div>

            <p className="my-3 text-shadow-lg md:text-2xl" style={{color: "white"}}>
          "Connection begins with clarity."
                          </p>
          </div>
        </div>

        {/* Rotating cube replaces the image transition */}
        <div className="h-full w-full flex items-center justify-center relative  ">
          <RotatingCube images={images}  className="bg-black"/>
        </div>
      </section>

      {/* All sections below use purple for text, icons, and button backgrounds */}
      <div style={{position: "relative", width: "100%", minHeight: "100vh", zIndex: 0, background: black}}>
        <ParticlesBackground />
        <div style={{position: "relative", zIndex: 1}}>
          <section className="w-full bg-transparent" style={{color: purple}}>
            <div className="w-full h-1/2 flex flex-col items-center justify-center text-center lg:h-1/6">
              <h1 className="text-3xl font-bold text-shadow-lg mb-2 mt-[10%]" style={{color: purple}}>Why Lead spark?</h1>
              <p className="my-3 text-shadow-lg max-w-xl p-4" style={{color: purple}}>
                Discover how MindfullMe can help you on your mental health journey
              </p>
            </div>

            <div className="w-full h-1/2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 items-center justify-center">
              {features.map((feature, index) => (
                <Box
                  key={index}
                  data-aos="fade"
                  data-aos-delay={index * 200}
                  sx={{
                    minWidth: 230,
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: 6,
                    },
                  }}
                >
                  <Card variant="outlined" sx={{ height: '100%' ,textAlign:"center" ,bgcolor:"rgba(30,30,30,0.9)", border:"none"}} className=" ">
                    <CardContent>
                      <div className="flex items-center gap-2 mb-2" style={{color: "rgb(239, 246, 255)", justifyContent: "center"}}>
                        {feature.icon}
                      </div>
                      <Typography variant="h6" component="div" sx={{ mb: 1, fontWeight: 'bold', whiteSpace:"nowrap", fontSize:{md:"1.2vmax" }, color: "rgb(239, 246, 255)" }}>
                        {feature.subtitle}
                      </Typography>
                      <Typography variant="body2" sx={{color: purple}}>
                        {feature.content}
                      </Typography>
                    </CardContent>
                  </Card>
                </Box>
              ))}
            </div>
          </section>

      <section className='w-full h-[60vh] flex gap-y-8 justify-center items-center text-center flex-col bg-transparent' style={{color: purple}}>
            <h1 className='text-3xl font-bold text-shadow-lg'>Track Your Lead Pipeline</h1>
            <a href="/login?mode=signin" className="inline-flex items-center justify-center px-6 py-2 rounded-full border-2 border-black text-black font-semibold bg-blue-50 transition no-underline">
              Try the Live Demo
            </a>
          </section>
             {/* Resource Highlights */}
          <section className="w-full p-4 mt-10" data-aos="fade" style={{color: purple}}>
            <h1 className="text_style flex justify-center p-8">Resource Highlights</h1>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: "Smart Filters",
                  desc: "Refine leads by location, role, industry, and more.",
                  img: "https://miro.medium.com/v2/resize:fit:900/0*TMvhLMMOy0NHzNIy.gif",
                  category: "Filtering",
                  time: "Instant",
                  author: "LeadPilot AI"
                },
                {
                  title: "Cold Email Generator",
                  desc: "AI-written emails optimized for engagement and replies.",
                  img: "https://bridgentech.com/wp-content/uploads/2023/06/Data-Engineering.gif",
                  category: "Email",
                  time: "5 sec",
                  author: "LeadPilot AI"
                },
                {
                  title: "Lead Scoring",
                  desc: "AI-powered scores to help prioritize outreach.",
                  img: "https://cdn-icons-gif.flaticon.com/6416/6416398.gif",
                  category: "AI Scoring",
                  time: "Real-time",
                  author: "LeadPilot AI"
                },
                {
                  title: "Data Export",
                  desc: "Push leads to your CRM or download them as CSV.",
                  img: "https://cdn-icons-png.flaticon.com/512/616/616490.png",
                  category: "Export",
                  time: "1 click",
                  author: "LeadPilot AI"
                }
              ].map((item, index) => (
                <div
                  key={index}
                  className="relative rounded-xl shadow-md overflow-hidden flex flex-col group transition-transform hover:shadow-xl"
                  style={{ minHeight: 340, background: "rgba(30,30,30,0.95)" }}
                >
                  <div
                    className="w-full h-70 bg-center bg-cover bg-no-repeat  transition-all duration-300"
                    style={{
                      backgroundImage: `url('${item.img}')`,
                      borderTopLeftRadius: '12px',
                      borderTopRightRadius: '12px',
                    }}
                  />
                  
                  <div className="absolute top-0 left-0 w-full h-40 opacity-0 group-hover:opacity-30 transition duration-200 bg-black rounded-t-xl"></div>

                  <div className="absolute top-0 left-0 w-full h-40 opacity-0 group-hover:opacity-100 transition duration-200 flex flex-col justify-between p-4 pointer-events-none">
                    <div className="flex justify-between items-center">
                      <span className="bg-black/80 text-xs px-2 py-1 rounded font-semibold" style={{color: purple}}>{item.category}</span>
                      <span className="text-xs bg-black/80 px-2 py-1 rounded" style={{color: purple}}>
                        ⏱ {item.time}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 flex flex-col justify-center h-40">
                    <h2 className="text-lg font-semibold mb-1" style={{color: purple}}>{item.title}</h2>
                    <p className="text-sm mb-2" style={{color: purple}}>{item.desc}</p>
                    <span className="text-xs" style={{color: purple}}>by <span className="font-semibold">{item.author}</span></span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center mt-8">
              <a
                href="/login?mode=signin"
                className="inline-flex items-center justify-center px-6 py-2 rounded-full border-2 border-blue-50 text-blue-50 font-semibold bg-transperent transition no-underline"
              >
                View Full Features
              </a>
            </div>
          </section>

          {/* Testimonials */}
          <section className="w-full" style={{background: black, color: purple}}>
            <div className="w-full flex flex-col items-center justify-center text-center py-10">
              <h1 className="text-3xl font-bold text-shadow-lg mb-2">Client Testimonials</h1>
            </div>

            <div className="w-full grid grid-cols-1  md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 ">
              {[
                {
                  text: "The AI suggestions helped us double our B2B outreach in 2 weeks.",
                  author: "— Sarah, SaaS Startup Founder"
                },
                {
                  text: "The scraper + enrichment combo is unreal. It saved us hours every day.",
                  author: "— Jordan, SDR Lead"
                },
                {
                  text: "I never thought I could automate so much of the top-of-funnel work.",
                  author: "— Ravi, Admissions Manager"
                }
              ].map((testimonial, idx) => (
                <div
                  key={idx}
                  className="bg-black p-6 rounded-lg shadow-lg text-shadow-md h-full flex flex-col justify-between border border-blue-50 "
                  data-aos="fade"
                 
                >
                  <p className="mb-4">{testimonial.text}</p>
                  <div className="flex items-center gap-3 mt-4">
                    <p className="font-semibold">{testimonial.author}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* How It Works */}
          <section className="w-full h-screen flex flex-col items-center justify-end bg-transparent md:mt-0" data-aos="fade" style={{color: purple}}>
            <h1 className="text-2xl font-bold mb-10">How It Works</h1>

            <div className="flex flex-col md:flex-row items-center justify-center gap-12 w-full max-w-5xl mb-16 px-4">

              <div className="flex flex-col items-center text-center">
                <IoPersonAddOutline className="text-blue-400 text-4xl mb-4" />
                <h2 className="font-semibold text-lg mb-1">Sign Up</h2>
                <p className="text-sm">Create your account and define your lead criteria</p>
              </div>

              <div className="hidden md:block text-[#ccccff] text-2xl">
                <FaArrowRight />
              </div>

              <div className="flex flex-col items-center text-center">
                <AiOutlineStock className="text-blue-400 text-4xl mb-4" />
                <h2 className="font-semibold text-lg mb-1">Run Discovery</h2>
                <p className="text-sm">Our AI scans sources like LinkedIn and databases in minutes</p>
              </div>

              <div className="hidden md:block text-[#ccccff] text-2xl">
                <FaArrowRight />
              </div>

              <div className="flex flex-col items-center text-center">
                <IoMdCloudDone className="text-blue-400 text-4xl mb-4" />
                <h2 className="font-semibold text-lg mb-1">Review & Outreach</h2>
                <p className="text-sm">View enriched leads and launch personalized campaigns</p>
              </div>
            </div>

            {/* Footer CTA */}
            <div className="w-full h-2/5 py-6 text-center flex flex-col justify-center items-center gap-2" style={{background: "#181818"}}>
              <h1 className="text-lg md:text-2xl font-bold mb-4">Stay Ahead of the Prospecting Game</h1>
              <form className="flex justify-center items-center gap-2 px-4">
                <input
                  type="email"
                  placeholder="Your email"
                  className="px-4 py-2 rounded-l-full bg-white w-64 text-black focus:outline-none"
                />
                <button className="rounded-r-full bg-[#ccccff] text-black px-4 py-2 font-semibold">
                  Subscribe
                </button>
              </form>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

export default Home;





















