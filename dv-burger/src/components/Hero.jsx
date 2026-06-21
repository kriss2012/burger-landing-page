import React, { useEffect, useRef, useState } from "react";
import "./Hero.css";
import Navbar from "./Navbar";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, AnimatePresence } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

// Ingredients details
const ALL_INGREDIENTS = [
  { id: 'topBun', name: 'Sesame Brioche Bun (Top)', src: './images/bun1.png', desc: 'Handcrafted sesame bun, lightly toasted with butter.', price: 1.5, calories: 150, category: 'bun' },
  { id: 'basil', name: 'Fresh Basil Leaves', src: './images/basil1.png', desc: 'Garden-fresh Italian sweet basil leaves for an aromatic punch.', price: 0.5, calories: 5, category: 'veg' },
  { id: 'lettuceTop', name: 'Crisp Romaine Lettuce', src: './images/let1.png', desc: 'Crisp romaine lettuce leaf selected for premium crunch.', price: 0.75, calories: 10, category: 'veg' },
  { id: 'cheese', name: 'Aged Cheddar Cheese Slice', src: './images/cheese.png', desc: 'Melted cheddar cheese providing rich and oozy creaminess.', price: 1.25, calories: 110, category: 'cheese' },
  { id: 'tomato', name: 'Vine-Ripened Tomato', src: './images/tomato.png', desc: 'Juicy, vine-ripened tomatoes sliced in thick round rings.', price: 0.75, calories: 15, category: 'veg' },
  { id: 'patty', name: 'Flame-Grilled Beef Patty', src: './images/meat.png', desc: 'Premium 100% Angus beef patty, flame-grilled to lock in juices.', price: 3.5, calories: 320, category: 'patty' },
  { id: 'lettuceBottom', name: 'Shredded Iceberg Lettuce', src: './images/let.png', desc: 'Freshly shredded organic lettuce adding juicy texture.', price: 0.5, calories: 10, category: 'veg' },
  { id: 'bottomBun', name: 'Garlic Butter Bun (Bottom)', src: './images/bunn2.png', desc: 'Toasted brioche bottom glazed with garlic-infused butter.', price: 1.0, calories: 120, category: 'bun' }
];

const BURGER_PRESETS = [
  {
    id: 'classic',
    name: 'Classic Whopper King',
    subtitle: 'The Legendary Flame-Grilled Beef Original',
    price: 12.99,
    description: 'The absolute classic. 100% flame-grilled beef patty, melted cheddar cheese, crisp romaine and iceberg lettuce, and vine-ripened tomatoes.',
    nutrition: { calories: 720, protein: 42, carbs: 45, fat: 35 },
    ingredients: { topBun: true, basil: false, lettuceTop: true, cheese: true, tomato: true, patty: true, lettuceBottom: true, bottomBun: true },
    extraPatty: false,
    extraCheese: false,
    colorFrom: 'from-amber-600',
    colorTo: 'to-red-950',
    badge: 'Best Seller'
  },
  {
    id: 'veggie',
    name: 'Crispy Veggie Paradise',
    subtitle: 'Fresh herbs, dual cheese, and garden-crisp greens',
    price: 10.49,
    description: 'A light yet satisfying veggie option. Melted double cheddar cheese, garden-fresh basil leaves, juicy vine tomatoes, and layers of crisp premium romaine lettuce.',
    nutrition: { calories: 410, protein: 18, carbs: 48, fat: 18 },
    ingredients: { topBun: true, basil: true, lettuceTop: true, cheese: true, tomato: true, patty: false, lettuceBottom: true, bottomBun: true },
    extraPatty: false,
    extraCheese: true,
    colorFrom: 'from-green-600',
    colorTo: 'to-emerald-950',
    badge: 'Vegetarian'
  },
  {
    id: 'mixveg',
    name: 'Loaded Spicy Mix-Veg',
    subtitle: 'Kick of heat with fresh basil & juicy tomato layers',
    price: 11.29,
    description: 'Crafted for spice lovers. Flame-grilled mix-vegetable spicy patty seasoned with house herbs, cheddar cheese, fresh basil leaves, and ripe vine tomatoes.',
    nutrition: { calories: 510, protein: 20, carbs: 52, fat: 22 },
    ingredients: { topBun: true, basil: true, lettuceTop: false, cheese: true, tomato: true, patty: true, lettuceBottom: true, bottomBun: true },
    extraPatty: false,
    extraCheese: false,
    colorFrom: 'from-orange-600',
    colorTo: 'to-red-950',
    badge: 'Spicy'
  },
  {
    id: 'doublecheese',
    name: 'HD Royal Double-Decker',
    subtitle: 'Double flame-grilled patties, double cheese layers',
    price: 15.99,
    description: 'The ultimate satisfaction. Two premium flame-grilled patties, double melted cheddar, vine-ripened tomatoes, and crisp lettuce for an absolute feast.',
    nutrition: { calories: 1080, protein: 68, carbs: 50, fat: 58 },
    ingredients: { topBun: true, basil: false, lettuceTop: true, cheese: true, tomato: true, patty: true, lettuceBottom: true, bottomBun: true },
    extraPatty: true,
    extraCheese: true,
    colorFrom: 'from-yellow-600',
    colorTo: 'to-amber-950',
    badge: 'Chef Choice'
  }
];

const Hero = () => {
  // Preset selector state
  const [activePreset, setActivePreset] = useState(BURGER_PRESETS[0]);
  
  // Customizer state
  const [customIngredients, setCustomIngredients] = useState(BURGER_PRESETS[0].ingredients);
  const [extraCheese, setExtraCheese] = useState(BURGER_PRESETS[0].extraCheese);
  const [extraPatty, setExtraPatty] = useState(BURGER_PRESETS[0].extraPatty);
  const [isCustomizerExploded, setIsCustomizerExploded] = useState(false);
  const [hoveredLayer, setHoveredLayer] = useState(null);
  
  // Cart state
  const [cartState, setCartState] = useState("idle"); // idle -> loading -> success
  const [cartCount, setCartCount] = useState(0);

  // GSAP scroll trigger refs
  const deconstructRef = useRef(null);
  const layersRef = useRef([]);

  // Sync customizer inputs when preset changes
  const selectPreset = (preset) => {
    setActivePreset(preset);
    setCustomIngredients(preset.ingredients);
    setExtraCheese(preset.extraCheese);
    setExtraPatty(preset.extraPatty);
  };

  // Toggle dynamic ingredients
  const toggleIngredient = (id) => {
    setCustomIngredients(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Calculate live price and nutritional stats
  const getStats = () => {
    let price = 5.99; // Base pricing
    let calories = 220;
    let protein = 6;
    let carbs = 36;
    let fat = 4;

    ALL_INGREDIENTS.forEach(ing => {
      if (customIngredients[ing.id]) {
        price += ing.price;
        calories += ing.calories;
        if (ing.category === 'patty') { protein += 28; fat += 22; carbs += 2; }
        else if (ing.category === 'cheese') { protein += 7; fat += 9; carbs += 1; }
        else if (ing.category === 'veg') { carbs += 3; protein += 1; }
      }
    });

    if (extraCheese) {
      price += 1.25;
      calories += 110;
      protein += 7;
      fat += 9;
      carbs += 1;
    }

    if (extraPatty) {
      price += 3.50;
      calories += 320;
      protein += 28;
      fat += 22;
      carbs += 2;
    }

    return {
      price: price.toFixed(2),
      calories,
      protein,
      carbs,
      fat
    };
  };

  const currentStats = getStats();

  // Scroll Trigger animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Pinning the inner deconstruct wrapper
      ScrollTrigger.create({
        trigger: "#deconstruct",
        start: "top top",
        end: "bottom bottom",
        pin: ".deconstruct-sticky-content",
        scrub: true,
      });

      // Factor calculations to pull burger together at scroll=0 and explode at scroll=1
      // Assembled translation pulling top down and bottom up, exploded pushing apart
      layersRef.current.forEach((layer, index) => {
        if (!layer) return;
        const factor = index - 3.5;
        const assembledY = factor * -46;
        const explodedY = factor * 48;

        gsap.fromTo(layer, 
          { y: assembledY }, 
          {
            y: explodedY,
            scrollTrigger: {
              trigger: "#deconstruct",
              start: "top top",
              end: "bottom bottom",
              scrub: true,
            }
          }
        );
      });

      // Fade in connector lines and labels as we scroll
      gsap.fromTo(".deconstruct-fade-item", 
        { opacity: 0.1, y: 15 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          scrollTrigger: {
            trigger: "#deconstruct",
            start: "top+=15% top",
            end: "bottom-=20% bottom",
            scrub: true,
          }
        }
      );
    }, deconstructRef);

    return () => ctx.revert();
  }, []);

  // Assemble current visible layers for customizer stack
  const getCustomizerLayers = () => {
    const layers = [];
    
    if (customIngredients.topBun) {
      layers.push({ id: 'topBun', name: 'Sesame Bun (Top)', src: './images/bun1.png' });
    }
    if (customIngredients.basil) {
      layers.push({ id: 'basil', name: 'Basil Leaves', src: './images/basil1.png' });
    }
    if (customIngredients.lettuceTop) {
      layers.push({ id: 'lettuceTop', name: 'Romaine Lettuce', src: './images/let1.png' });
    }
    if (customIngredients.cheese) {
      layers.push({ id: 'cheese', name: 'Cheddar Cheese', src: './images/cheese.png' });
    }
    if (extraCheese) {
      layers.push({ id: 'extraCheese', name: 'Extra Cheddar', src: './images/cheese.png' });
    }
    if (customIngredients.tomato) {
      layers.push({ id: 'tomato', name: 'Vine Tomato', src: './images/tomato.png' });
    }
    if (customIngredients.patty) {
      layers.push({ id: 'patty', name: 'Flame Patty', src: './images/meat.png' });
    }
    if (extraPatty) {
      layers.push({ id: 'extraPatty', name: 'Extra Patty', src: './images/meat.png' });
    }
    if (customIngredients.lettuceBottom) {
      layers.push({ id: 'lettuceBottom', name: 'Iceberg Lettuce', src: './images/let.png' });
    }
    if (customIngredients.bottomBun) {
      layers.push({ id: 'bottomBun', name: 'Garlic Bun (Bottom)', src: './images/bunn2.png' });
    }
    
    return layers;
  };

  const customizerLayers = getCustomizerLayers();

  // Add to cart click handler
  const handleAddToCart = () => {
    if (cartState !== "idle") return;
    setCartState("loading");
    setTimeout(() => {
      setCartState("success");
      setCartCount(prev => prev + 1);
      setTimeout(() => {
        setCartState("idle");
      }, 2000);
    }, 1200);
  };

  return (
    <div className="relative min-h-screen bg-[#0a0303] overflow-x-hidden selection:bg-amber-500 selection:text-black">
      <Navbar onOpenCustomizer={() => document.getElementById('customizer')?.scrollIntoView({ behavior: 'smooth' })} />

      {/* Floating cart indicator in bottom corner */}
      <div className="fixed bottom-6 right-6 z-50">
        <button 
          onClick={() => document.getElementById('customizer')?.scrollIntoView({ behavior: 'smooth' })}
          className="relative p-4 bg-gradient-to-r from-amber-500 to-red-600 rounded-full text-white shadow-xl hover:shadow-red-600/40 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
          </svg>
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-white text-red-600 text-xs font-black w-5 h-5 flex items-center justify-center rounded-full animate-bounce">
              {cartCount}
            </span>
          )}
        </button>
      </div>

      {/* SECTION 1: HERO CONTAINER */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center pt-24 pb-16 px-6 lg:px-12 z-10 overflow-hidden">
        {/* Background decorations */}
        <div className="ambient-glow -top-20 -left-20"></div>
        <div className="ambient-glow-red top-1/2 -right-40"></div>
        
        {/* Outline decorative background typography */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden opacity-5 z-0">
          <h1 className="text-[18vw] font-black uppercase text-white font-['Anton'] tracking-wider leading-none">FLAMEGRILLED</h1>
        </div>

        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center z-10">
          {/* Hero Left: Preset selectors and info */}
          <div className="lg:col-span-6 flex flex-col items-start text-left">
            <span className="px-4 py-1.5 bg-red-600/10 border border-red-600/30 text-red-500 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
              Only at Burger King
            </span>
            
            <h1 className="title-huge text-6xl md:text-8xl font-extrabold text-white tracking-wide uppercase">
              FLAME<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-500 to-red-500">GRILLED</span>
            </h1>

            <p className="text-gray-300 mt-6 text-base md:text-lg leading-relaxed max-w-xl">
              Freshly crafted ingredients, flame-grilled to sizzling perfection. Welcome to the home of high-definition flavor — choose your signature crown.
            </p>

            {/* Quick preset selector cards */}
            <div className="grid grid-cols-2 gap-4 w-full max-w-xl mt-8">
              {BURGER_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => selectPreset(preset)}
                  className={`p-4 rounded-2xl text-left border transition-all duration-300 cursor-pointer ${
                    activePreset.id === preset.id
                      ? 'bg-amber-500/10 border-amber-500/50 shadow-lg shadow-amber-500/5'
                      : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/8'
                  }`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] uppercase tracking-wider font-extrabold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded">
                      {preset.badge}
                    </span>
                    <span className="text-sm font-bold text-white">${preset.price}</span>
                  </div>
                  <h3 className="font-bold text-sm text-white tracking-wide">{preset.name}</h3>
                </button>
              ))}
            </div>

            <div className="flex flex-wrap gap-4 mt-8">
              <button 
                onClick={() => document.getElementById('customizer')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-3.5 bg-gradient-to-r from-amber-500 to-red-600 hover:from-amber-600 hover:to-red-700 text-white font-bold rounded-full uppercase tracking-wider shadow-lg shadow-red-600/20 active:scale-95 transition-all duration-300 cursor-pointer text-sm"
              >
                Customize Your Burger
              </button>
              <a 
                href="#deconstruct"
                className="px-8 py-3.5 bg-white/5 hover:bg-white/10 text-white font-bold rounded-full uppercase tracking-wider border border-white/10 active:scale-95 transition-all duration-300 text-sm flex items-center gap-2"
              >
                Deconstruct View
              </a>
            </div>
          </div>

          {/* Hero Right: Static Assembled Burger Preview */}
          <div className="lg:col-span-6 flex justify-center relative min-h-[400px]">
            {/* Soft backdrop radial glow */}
            <div className="absolute w-[350px] h-[350px] bg-gradient-to-tr from-amber-500/20 to-red-600/20 rounded-full blur-[80px] -z-10 animate-pulse"></div>

            {/* Assemble the selected preset burger visually */}
            <div className="relative w-full max-w-[380px] h-[400px] flex items-center justify-center">
              {ALL_INGREDIENTS.map((ing, idx) => {
                // If ingredient is active in activePreset
                const isActive = activePreset.ingredients[ing.id];
                if (!isActive) return null;

                // Spacing offsets for the beautiful static burger render
                const activeLayers = ALL_INGREDIENTS.filter(i => activePreset.ingredients[i.id]);
                const currentIdx = activeLayers.findIndex(i => i.id === ing.id);
                const offset = currentIdx - (activeLayers.length - 1) / 2;
                
                // Adjust overlaps
                const y = offset * 22;

                return (
                  <img
                    key={ing.id}
                    src={ing.src}
                    alt={ing.name}
                    className="absolute w-[240px] md:w-[320px] h-auto object-contain drop-shadow-2xl transition-all duration-500"
                    style={{ 
                      transform: `translateY(${y}px)`, 
                      zIndex: activeLayers.length - currentIdx 
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* Bouncing scroll indicator */}
        <div className="scroll-indicator animate-bounce-slow hidden md:flex">
          <span>Scroll to Deconstruct</span>
          <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* SECTION 2: DECONSTRUCT CONTAINER (GSAP PINNED SCROLL EFFECT) */}
      <section id="deconstruct" ref={deconstructRef} className="relative w-full min-h-[160vh] bg-gradient-to-b from-[#0a0303] via-[#100404] to-[#070101] z-20">
        <div className="deconstruct-sticky-content w-full min-h-screen flex flex-col justify-center items-center px-6 lg:px-12 py-16">
          
          <div className="text-center mb-10 max-w-xl z-10 deconstruct-fade-item">
            <span className="text-amber-500 font-extrabold uppercase text-xs tracking-widest bg-amber-500/10 px-3 py-1 rounded-full mb-3 inline-block">
              Interactive Blueprint
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-wide">
              Culinary Deconstruction
            </h2>
            <p className="text-gray-400 text-xs md:text-sm mt-3">
              Slowly scroll to explode and inspect each high-definition layers. Each ingredient is sourced sustainably and cooked to royalty standards.
            </p>
          </div>

          {/* Self-aligning 8-row deconstructing grid */}
          <div className="w-full max-w-6xl mx-auto flex flex-col justify-center relative mt-6 gap-2 lg:gap-0 h-[600px] lg:h-[500px]">
            {ALL_INGREDIENTS.map((ing, idx) => {
              const isLeft = idx % 2 === 0;
              return (
                <div key={ing.id} className="grid grid-cols-1 lg:grid-cols-[1fr_120px_350px_120px_1fr] items-center h-[55px] lg:h-[45px] relative">
                  
                  {/* Left Label Column */}
                  <div className={`flex justify-end items-center ${isLeft ? 'opacity-100' : 'opacity-0 pointer-events-none'} deconstruct-fade-item`}>
                    {isLeft && (
                      <div className="text-right pr-4">
                        <h4 className="text-amber-500 font-bold uppercase text-xs md:text-sm tracking-wider">{ing.name}</h4>
                        <p className="text-gray-400 text-[10px] md:text-xs mt-0.5 hidden md:block max-w-[200px] ml-auto leading-normal">{ing.desc}</p>
                      </div>
                    )}
                  </div>

                  {/* Left Line Column */}
                  <div className="hidden lg:flex items-center justify-center">
                    {isLeft && (
                      <div className="w-full h-[1px] bg-gradient-to-r from-amber-500/0 to-amber-500/60 border-t border-dashed border-amber-500/30"></div>
                    )}
                  </div>

                  {/* Center Image Column */}
                  <div className="flex justify-center z-10">
                    <img 
                      ref={el => layersRef.current[idx] = el}
                      src={ing.src} 
                      alt={ing.name} 
                      className="w-[180px] md:w-[260px] h-auto object-contain burger-layer-img" 
                    />
                  </div>

                  {/* Right Line Column */}
                  <div className="hidden lg:flex items-center justify-center">
                    {!isLeft && (
                      <div className="w-full h-[1px] bg-gradient-to-r from-amber-500/60 to-amber-500/0 border-t border-dashed border-amber-500/30"></div>
                    )}
                  </div>

                  {/* Right Label Column */}
                  <div className={`flex justify-start items-center ${!isLeft ? 'opacity-100' : 'opacity-0 pointer-events-none'} deconstruct-fade-item`}>
                    {!isLeft && (
                      <div className="text-left pl-4">
                        <h4 className="text-amber-500 font-bold uppercase text-xs md:text-sm tracking-wider">{ing.name}</h4>
                        <p className="text-gray-400 text-[10px] md:text-xs mt-0.5 hidden md:block max-w-[200px] leading-normal">{ing.desc}</p>
                      </div>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 3: THE INTERACTIVE BURGER LAB CUSTOMIZER */}
      <section id="customizer" className="relative py-24 px-6 lg:px-12 bg-gradient-to-b from-[#070101] to-[#040101] z-20">
        <div className="ambient-glow top-1/4 left-1/3"></div>
        <div className="ambient-glow-red bottom-10 right-10"></div>

        <div className="w-full max-w-7xl mx-auto">
          
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <span className="text-red-500 font-extrabold uppercase text-xs tracking-widest bg-red-500/10 px-3 py-1 rounded-full mb-3 inline-block">
              Interactive Lab
            </span>
            <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-wide">
              The Burger Lab
            </h2>
            <p className="text-gray-400 text-sm mt-3">
              Become the chef. Toggle gourmet ingredients, adjust stacks, and watch your nutrition dashboard update in high-definition real-time.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
            
            {/* Customizer Left Panel: Burger Presets / Quick select */}
            <div className="lg:col-span-3 flex flex-col justify-start gap-4">
              <h3 className="text-lg font-bold text-white tracking-widest uppercase mb-2 border-l-2 border-amber-500 pl-3">
                1. Select Base Style
              </h3>
              {BURGER_PRESETS.map((preset) => (
                <div
                  key={preset.id}
                  onClick={() => selectPreset(preset)}
                  className={`p-5 rounded-2xl text-left border cursor-pointer transition-all duration-300 relative overflow-hidden group ${
                    activePreset.id === preset.id
                      ? 'bg-amber-500/10 border-amber-500/50 shadow-xl'
                      : 'bg-white/5 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-extrabold text-amber-500 uppercase tracking-widest bg-amber-500/20 px-2 py-0.5 rounded">
                      {preset.badge}
                    </span>
                    <span className="text-amber-500 font-bold text-sm">${preset.price}</span>
                  </div>
                  <h4 className="font-extrabold text-white text-base mb-1 tracking-wide">{preset.name}</h4>
                  <p className="text-gray-400 text-xs line-clamp-2 leading-relaxed">{preset.description}</p>
                </div>
              ))}
            </div>

            {/* Customizer Center Panel: Interactive Burger Stack View */}
            <div className="lg:col-span-5 glass-panel rounded-3xl p-6 flex flex-col items-center justify-between min-h-[500px] border border-white/5 relative overflow-hidden">
              
              <div className="w-full flex justify-between items-center z-10">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Layers Active: <span className="text-amber-500">{customizerLayers.length}</span>
                </span>
                
                {/* Explode / Assemble Switch */}
                <button
                  onClick={() => setIsCustomizerExploded(!isCustomizerExploded)}
                  className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 text-xs font-extrabold uppercase tracking-widest bg-white/5 hover:bg-white/10 transition-colors duration-300 cursor-pointer text-gray-300"
                >
                  <span className={isCustomizerExploded ? 'text-amber-500' : ''}>
                    {isCustomizerExploded ? 'Deconstructed' : 'Assemble Stack'}
                  </span>
                  <svg className={`w-4 h-4 transform transition-transform duration-300 ${isCustomizerExploded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>

              {/* Dynamic Burger Canvas Stack using Framer Motion */}
              <div className="relative w-full h-[380px] flex items-center justify-center my-6">
                <AnimatePresence mode="popLayout">
                  {customizerLayers.map((layer, idx) => {
                    const total = customizerLayers.length;
                    const centerIndex = (total - 1) / 2;
                    const offset = idx - centerIndex;
                    
                    // Gap spacing: wide when exploded, narrow when assembled
                    const spacing = isCustomizerExploded ? 62 : 18;
                    const y = offset * spacing;
                    
                    // Dim layers other than the one hovered
                    const isDimmed = hoveredLayer && hoveredLayer !== layer.id;
                    const isHighlighted = hoveredLayer === layer.id;

                    return (
                      <motion.img
                        key={layer.id}
                        layout
                        initial={{ opacity: 0, scale: 0.3, y: y - 80 }}
                        animate={{ 
                          opacity: 1, 
                          scale: isHighlighted ? 1.08 : 1, 
                          y: y,
                          filter: isDimmed 
                            ? 'brightness(0.3) blur(1px) grayscale(0.2)' 
                            : isHighlighted 
                              ? 'brightness(1.1) drop-shadow(0 20px 30px rgba(245,158,11,0.4))'
                              : 'brightness(1) drop-shadow(0 10px 15px rgba(0,0,0,0.4))'
                        }}
                        exit={{ opacity: 0, scale: 0.3, y: y + 80 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 24 }}
                        src={layer.src}
                        alt={layer.name}
                        className="absolute w-[200px] md:w-[280px] h-auto object-contain cursor-pointer"
                        style={{ zIndex: total - idx }}
                        onMouseEnter={() => setHoveredLayer(layer.id)}
                        onMouseLeave={() => setHoveredLayer(null)}
                      />
                    );
                  })}
                </AnimatePresence>
              </div>

              {/* Dynamic Layer Info Card */}
              <div className="w-full h-16 flex items-center justify-center text-center z-10 px-4 border-t border-white/5 pt-4">
                {hoveredLayer ? (
                  <div>
                    <h5 className="text-amber-500 font-extrabold uppercase text-xs tracking-wider">
                      {ALL_INGREDIENTS.find(i => i.id === hoveredLayer)?.name || 
                       (hoveredLayer === 'extraCheese' ? 'Extra Cheddar Cheese Slice' : 'Extra Flame-Grilled Beef Patty')}
                    </h5>
                    <p className="text-gray-400 text-xs mt-0.5 line-clamp-1 leading-normal">
                      {ALL_INGREDIENTS.find(i => i.id === hoveredLayer)?.desc || 
                       (hoveredLayer === 'extraCheese' ? 'Double cheddar goodness melted directly on the patty.' : 'An extra flame-grilled patty for the ultimate carnivore.')}
                    </p>
                  </div>
                ) : (
                  <span className="text-gray-500 text-xs italic tracking-wide">
                    Hover over layers to inspect chef details
                  </span>
                )}
              </div>
            </div>

            {/* Customizer Right Panel: Control board, macros, cart */}
            <div className="lg:col-span-4 flex flex-col justify-between gap-6">
              
              {/* Ingredient Toggles */}
              <div className="glass-panel rounded-3xl p-6 border border-white/5">
                <h3 className="text-base font-bold text-white tracking-widest uppercase mb-4 border-l-2 border-amber-500 pl-3">
                  2. Choose Ingredients
                </h3>
                
                <div className="flex flex-col gap-3.5 max-h-[220px] overflow-y-auto pr-2">
                  {ALL_INGREDIENTS.map((ing) => (
                    <label key={ing.id} className="flex items-center justify-between p-2 hover:bg-white/5 rounded-xl transition-colors duration-200 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={!!customIngredients[ing.id]}
                          onChange={() => toggleIngredient(ing.id)}
                          className="w-4 h-4 rounded text-amber-500 bg-white/5 border-white/10 focus:ring-amber-500 cursor-pointer"
                        />
                        <span className="text-sm font-semibold text-gray-300">{ing.name}</span>
                      </div>
                      <span className="text-xs font-bold text-amber-500">+${ing.price}</span>
                    </label>
                  ))}
                </div>

                <div className="h-[1px] bg-white/5 my-4"></div>

                {/* Extras Toggles */}
                <div className="flex flex-col gap-3">
                  <label className="flex items-center justify-between p-2 hover:bg-white/5 rounded-xl transition-colors duration-200 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={extraCheese}
                        onChange={() => setExtraCheese(!extraCheese)}
                        className="w-4 h-4 rounded text-amber-500 bg-white/5 border-white/10 focus:ring-amber-500 cursor-pointer"
                      />
                      <span className="text-sm font-semibold text-gray-300">Extra Cheddar Cheese</span>
                    </div>
                    <span className="text-xs font-bold text-amber-500">+$1.25</span>
                  </label>
                  
                  <label className="flex items-center justify-between p-2 hover:bg-white/5 rounded-xl transition-colors duration-200 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={extraPatty}
                        onChange={() => setExtraPatty(!extraPatty)}
                        className="w-4 h-4 rounded text-amber-500 bg-white/5 border-white/10 focus:ring-amber-500 cursor-pointer"
                      />
                      <span className="text-sm font-semibold text-gray-300">Extra Flame-Grilled Patty</span>
                    </div>
                    <span className="text-xs font-bold text-amber-500">+$3.50</span>
                  </label>
                </div>
              </div>

              {/* Nutrition & Checkout panel */}
              <div className="glass-panel rounded-3xl p-6 border border-white/5 flex flex-col justify-between flex-grow">
                <div>
                  <h3 className="text-base font-bold text-white tracking-widest uppercase mb-4 border-l-2 border-amber-500 pl-3">
                    3. Live Nutrition Facts
                  </h3>
                  
                  {/* Progress dashboard bar grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-black/30 p-3 rounded-2xl border border-white/5 text-center">
                      <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Calories</span>
                      <p className="text-xl font-extrabold text-white mt-1">{currentStats.calories} <span className="text-xs font-normal text-gray-400">kcal</span></p>
                    </div>
                    <div className="bg-black/30 p-3 rounded-2xl border border-white/5 text-center">
                      <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Protein</span>
                      <p className="text-xl font-extrabold text-amber-500 mt-1">{currentStats.protein}g</p>
                    </div>
                    <div className="bg-black/30 p-3 rounded-2xl border border-white/5 text-center">
                      <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Carbs</span>
                      <p className="text-xl font-extrabold text-gray-300 mt-1">{currentStats.carbs}g</p>
                    </div>
                    <div className="bg-black/30 p-3 rounded-2xl border border-white/5 text-center">
                      <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Fat</span>
                      <p className="text-xl font-extrabold text-gray-300 mt-1">{currentStats.fat}g</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 border-t border-white/5 pt-4">
                  <div className="flex justify-between items-center mb-5">
                    <span className="text-gray-400 font-bold uppercase tracking-wider text-sm">Estimated Total:</span>
                    <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-500 font-['Anton'] tracking-wider">
                      ${currentStats.price}
                    </span>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    disabled={cartState !== "idle"}
                    className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 transition-all duration-300 active:scale-[0.98] cursor-pointer shadow-lg ${
                      cartState === "success" 
                        ? "bg-green-600 hover:bg-green-700 text-white shadow-green-600/20"
                        : "bg-gradient-to-r from-amber-500 to-red-600 hover:from-amber-600 hover:to-red-700 text-white shadow-red-600/20"
                    }`}
                  >
                    {cartState === "idle" && (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Add to Order
                      </>
                    )}
                    {cartState === "loading" && (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Sending Order...
                      </>
                    )}
                    {cartState === "success" && (
                      <>
                        <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                        Added Successfully!
                      </>
                    )}
                  </button>
                </div>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 border-t border-white/5 bg-black/60 relative z-25 text-center text-gray-500 text-xs">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <span className="font-['Anton'] text-lg tracking-wider text-gray-400">BURGER KING</span>
          <p>© 2026 Burger King Corporation. All rights reserved. Recoded with high-definition transitions.</p>
          <div className="flex gap-6 text-gray-400">
            <a href="#" className="hover:text-amber-500 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-amber-500 transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Hero;
