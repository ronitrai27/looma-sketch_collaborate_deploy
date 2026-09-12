"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoomaLanding() {
  const router = useRouter();

  useEffect(() => {
    document.documentElement.classList.add("anim");

    const timer = setTimeout(() => {
      document.documentElement.classList.remove("anim");
    }, 2600);

    return () => {
      clearTimeout(timer);
      document.documentElement.classList.remove("anim");
    };
  }, []);

  const goToAuth = (e?: React.MouseEvent | React.FocusEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    router.push("/auth");
  };

  return (
    <>
      <style jsx global>{`
        :root {
          --u: min(0.06410256vw, 0.12400794vh);
          --vu: 0.09920635vh;
          --inset-top: 41;
          --inset-bottom: 106;

          /* Nav */
          --brand-x: 225;
          --brand-y: 45;
          --mark: 34;
          --brand-gap: 12;
          --brand-fs: 18.49;
          --links-y: 50.5;
          --links-gap: 50;
          --links-fs: 21.69;
          --cta-x: 1195;
          --cta-y: 42;
          --cta-w: 140;
          --cta-h: 43;
          --cta-r: 12;
          --cta-fs: 15.7;
          --cta-dy: 2;

          /* Hero */
          --hero-gap: 51;
          --h1-y: 323;
          --h1-fs: 36.25;
          --display-ls: 0.0018em;
          --nav-ls: -0.0115em;
          --brand-ls: -0.0154em;
          --cta-ls: -0.0127em;
          --body-ls: 0.007em;
          --label-ls: normal;
          --model-ls: normal;
          --proof-ls: 0.0065em;

          --w-regular: 400;
          --w-display-wght: 410;
          --w-medium: 500;
          --w-semibold: 600;
          --w-display: var(--w-display-wght);
          --w-nav: 400;
          --w-brand: 500;
          --w-cta: 520;
          --w-body: var(--w-regular);
          --w-label: var(--w-medium);
          --w-model: var(--w-regular);
          --w-proof: 480;

          /* Composer */
          --card-x: 425;
          --card-y: 413;
          --card-w: 708;
          --card-h: 143;
          --card-r: 26;
          --ph-x: 452;
          --ph-y: 446;
          --ph-fs: 9.97;
          --chips-x: 444;
          --chips-y: 505;
          --chip-h: 30;
          --chip-r: 9;
          --chip-fs: 9;
          --chip-gap: 5.5;
          --son-fs: 10.4;
          --son-top: 15.5;
          --chev-gap: 6.2;
          --chev-x: 1013.5;
          --chev-y: 522.3;
          --att-x: 1043.2;
          --att-y: 515.1;
          --send-x: 1084;
          --send-y: 507;
          --send-d: 35;

          /* Footer */
          --by-y: 799;
          --by-fs: 14.01;
          --logo-y: 867;
          --logo-gap: 62;

          /* Easings */
          --e-primary: cubic-bezier(0.16, 1, 0.3, 1);
          --e-soft: cubic-bezier(0.22, 1, 0.36, 1);
        }

        @supports (height: 100dvh) {
          :root {
            --u: min(0.06410256vw, 0.12400794dvh);
            --vu: 0.09920635dvh;
          }
        }

        @media (min-width: 1561px) {
          :root {
            --inset-top: 27;
            --inset-bottom: 74;
          }
        }

        html,
        body {
          height: 100%;
          overflow: hidden;
          background: #0a0d12;
          font-synthesis: none;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          text-rendering: geometricPrecision;
        }

        :focus-visible {
          outline: 2px solid #f8b285;
          outline-offset: 3px;
          border-radius: 4px;
        }

        /* ------------------ ENTRANCE ANIMATIONS ------------------ */
        @keyframes e-settle-down {
          from {
            opacity: 0;
            transform: translateY(calc(-5 * var(--u)));
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes e-settle-up {
          from {
            opacity: 0;
            transform: translateY(calc(6 * var(--u)));
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes e-mark {
          from {
            transform: scale(0.9);
          }
          to {
            transform: scale(1);
          }
        }

        @keyframes e-focus {
          from {
            opacity: 0;
            transform: translateY(calc(14 * var(--u)));
            filter: blur(calc(6 * var(--u)));
          }
          to {
            opacity: 1;
            transform: translateY(0);
            filter: blur(0);
          }
        }

        @keyframes e-panel {
          from {
            opacity: 0;
            transform: translateY(calc(18 * var(--u))) scale(0.985);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes e-populate {
          from {
            opacity: 0;
            transform: translateY(calc(4 * var(--u)));
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes e-send {
          from {
            transform: scale(0.82);
          }
          to {
            transform: scale(1);
          }
        }

        html.anim .anim-brand {
          animation: e-settle-down 0.58s var(--e-soft) 0.06s both;
        }
        html.anim .anim-mark {
          animation: e-mark 0.62s var(--e-primary) 0.06s both;
        }
        html.anim .anim-link-1 {
          animation: e-settle-down 0.5s var(--e-soft) 0.16s both;
        }
        html.anim .anim-link-2 {
          animation: e-settle-down 0.5s var(--e-soft) 0.21s both;
        }
        html.anim .anim-link-3 {
          animation: e-settle-down 0.5s var(--e-soft) 0.26s both;
        }
        html.anim .anim-link-4 {
          animation: e-settle-down 0.5s var(--e-soft) 0.31s both;
        }
        html.anim .anim-cta {
          animation: e-settle-down 0.55s var(--e-soft) 0.34s both;
        }
        html.anim .anim-h1 {
          animation: e-focus 1s var(--e-primary) 0.3s both;
          will-change: transform, opacity;
        }
        html.anim .anim-card {
          animation: e-panel 0.9s var(--e-primary) 0.62s both;
          will-change: transform, opacity;
        }
        html.anim .anim-ph {
          animation: e-populate 0.5s var(--e-soft) 0.88s both;
        }
        html.anim .anim-chips {
          animation: e-populate 0.5s var(--e-soft) 0.94s both;
        }
        html.anim .anim-right {
          animation: e-populate 0.5s var(--e-soft) 1s both;
        }
        html.anim .anim-send {
          animation: e-send 0.5s var(--e-primary) 1s both;
        }
        html.anim .anim-proof-by {
          animation: e-settle-up 0.55s var(--e-soft) 1.08s both;
        }
        html.anim .anim-logo-1 {
          animation: e-settle-up 0.55s var(--e-soft) 1.16s both;
        }
        html.anim .anim-logo-2 {
          animation: e-settle-up 0.55s var(--e-soft) 1.22s both;
        }
        html.anim .anim-logo-3 {
          animation: e-settle-up 0.55s var(--e-soft) 1.28s both;
        }

        @media (prefers-reduced-motion: reduce) {
          html.anim * {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }
        }

        /* ------------------ DESKTOP ARCHITECTURE (DEFAULT) ------------------ */
        .stage-frame {
          padding: calc(var(--inset-top) * var(--vu)) calc(225 * var(--u))
            calc(var(--inset-bottom) * var(--vu));
        }

        .desktop-nav-center {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          top: calc((50.5 - 41) * var(--u));
          display: flex;
          align-items: center;
          gap: calc(var(--links-gap) * var(--u));
        }

        .composer-card {
          width: calc(var(--card-w) * var(--u));
          height: calc(var(--card-h) * var(--u));
          border-radius: calc(var(--card-r) * var(--u));
          margin-right: calc(3 * var(--u));
          background: rgba(41, 41, 43, 0.955);
          backdrop-filter: blur(calc(26 * var(--u))) saturate(112%);
          -webkit-backdrop-filter: blur(calc(26 * var(--u))) saturate(112%);
          box-shadow:
            inset 0 0 0 1px rgba(214, 228, 255, 0.14),
            0 calc(22 * var(--u)) calc(60 * var(--u)) rgba(0, 0, 0, 0.3);
          position: relative;
          cursor: pointer;
        }

        .composer-ph {
          position: absolute;
          left: calc(27 * var(--u));
          top: calc(33 * var(--u));
          right: calc(24 * var(--u));
          color: #8b8c8e;
          font-size: calc(var(--ph-fs) * var(--u));
          font-weight: var(--w-body);
          line-height: 1.35;
          letter-spacing: var(--body-ls);
          white-space: nowrap;
          overflow: hidden;
          cursor: pointer;
        }

        .composer-tools {
          position: absolute;
          left: calc(19 * var(--u));
          top: calc(92 * var(--u));
          height: calc(var(--chip-h) * var(--u));
          right: calc((425 + 708 - 1134) * var(--u));
        }

        .composer-chips {
          display: flex;
          align-items: center;
          gap: calc(var(--chip-gap) * var(--u));
          height: 100%;
        }

        .composer-chip {
          height: calc(var(--chip-h) * var(--u));
          border-radius: calc(var(--chip-r) * var(--u));
          font-size: calc(var(--chip-fs) * var(--u));
          font-weight: var(--w-label);
          color: #909093;
          line-height: 1;
          background: linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.088) 0%,
            rgba(255, 255, 255, 0.05) 45%,
            rgba(255, 255, 255, 0.038) 100%
          );
          border: 1px solid rgba(255, 255, 255, 0.05);
          display: inline-flex;
          align-items: center;
          cursor: pointer;
          transition:
            background 0.15s ease,
            color 0.15s ease;
        }

        .composer-chip:hover {
          background: linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.14),
            rgba(255, 255, 255, 0.07)
          );
          color: #c8c8cb;
        }

        .composer-right {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .composer-right > * {
          position: absolute;
          pointer-events: auto;
        }

        .composer-model {
          left: calc(510.2 * var(--u));
          top: calc(var(--son-top) * var(--u));
          font-size: calc(var(--son-fs) * var(--u));
          font-weight: var(--w-model);
          color: #98999c;
          line-height: 1;
          display: inline-flex;
          align-items: center;
          gap: calc(var(--chev-gap) * var(--u));
          cursor: pointer;
        }

        .composer-attach {
          left: calc(599.15 * var(--u));
          top: calc(10.14 * var(--u));
          color: #a9aaad;
          cursor: pointer;
          transition: color 0.15s ease;
        }

        .composer-attach:hover {
          color: #ffffff;
        }

        .composer-send {
          left: calc(640 * var(--u));
          top: calc(2 * var(--u));
          width: calc(var(--send-d) * var(--u));
          height: calc(var(--send-d) * var(--u));
          border-radius: 50%;
          background: linear-gradient(
            163deg,
            #fbbc94 0%,
            #f49d70 46%,
            #e88654 100%
          );
          box-shadow: 0 calc(3 * var(--u)) calc(12 * var(--u))
            rgba(210, 110, 60, 0.34);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition:
            filter 0.15s ease,
            transform 0.1s ease;
        }

        .composer-send:hover {
          filter: brightness(1.07);
        }

        .composer-send:active {
          transform: scale(0.95);
        }

        .mobile-burger,
        .mobile-sheet {
          display: none;
        }

        /* ------------------ TABLET ARCHITECTURE ------------------ */
        @media (min-width: 600px) and (max-width: 1180px) and (min-height: 600px) {
          :root {
            --u: 1px;
          }

          .stage-frame {
            padding: clamp(24px, 3.4vh, 44px) clamp(28px, 4.2vw, 60px)
              clamp(26px, 4.4vh, 56px);
          }

          .hero-h1 {
            font-size: clamp(27px, 4.3vw, 44px);
            line-height: 1.12;
          }

          .composer-card {
            width: min(100%, clamp(516px, 74vw, 760px));
            height: auto;
            margin-right: 0;
            padding: clamp(15px, 1.9vw, 24px);
            border-radius: clamp(17px, 2.1vw, 26px);
            display: flex;
            flex-direction: column;
            gap: clamp(20px, 3.2vh, 44px);
          }

          .composer-ph {
            position: static;
            white-space: normal;
            font-size: clamp(11px, 1.35vw, 14px);
            line-height: 1.4;
          }

          .composer-tools {
            position: static;
            height: auto;
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            align-items: center;
            gap: clamp(10px, 1.4vw, 18px);
          }

          .composer-chips {
            flex-wrap: nowrap;
            gap: clamp(6px, 0.85vw, 10px);
          }

          .composer-chip {
            width: auto !important;
            height: clamp(29px, 3.4vh, 34px);
            padding: 0 clamp(7px, 1vw, 13px) !important;
            font-size: clamp(9.6px, 1.12vw, 12.5px);
          }

          .composer-right {
            position: static;
            display: flex;
            align-items: center;
            margin-left: auto;
            gap: 0;
            pointer-events: auto;
          }

          .composer-right > * {
            position: static;
          }

          .composer-model {
            font-size: clamp(9.8px, 1.12vw, 12.5px);
          }

          .composer-attach {
            margin-left: clamp(9px, 1.4vw, 20px);
          }

          .composer-send {
            margin-left: clamp(9px, 1.3vw, 18px);
            width: clamp(32px, 3.5vw, 38px);
            height: clamp(32px, 3.5vw, 38px);
          }

          .proof-wrap {
            gap: clamp(15px, 2.5vh, 30px);
          }
        }

        /* ------------------ COMPACT / PHONE ARCHITECTURE ------------------ */
        @media (max-width: 599px),
          (max-height: 599px) and (max-width: 1180px) {
          :root {
            --u: 1px;
          }

          .stage-frame {
            padding: max(18px, env(safe-area-inset-top))
              max(clamp(18px, 5.2vw, 40px), env(safe-area-inset-right))
              max(20px, env(safe-area-inset-bottom))
              max(clamp(18px, 5.2vw, 40px), env(safe-area-inset-left));
          }

          .desktop-nav-center,
          .header-cta {
            display: none !important;
          }

          .mobile-burger {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 38px;
            height: 38px;
            border-radius: 11px;
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.14);
            color: #ffffff;
            cursor: pointer;
          }

          .mobile-sheet {
            display: grid;
            grid-template-rows: 0fr;
            transition: grid-template-rows 0.32s cubic-bezier(0.4, 0, 0.2, 1);
            position: absolute;
            top: calc(max(18px, env(safe-area-inset-top)) + 50px);
            left: 18px;
            right: 18px;
            z-index: 50;
          }

          #menu:checked ~ .mobile-sheet {
            grid-template-rows: 1fr;
          }

          .mobile-sheet-content {
            overflow: hidden;
            background: rgba(24, 24, 27, 0.86);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border-radius: 16px;
            border: 1px solid rgba(255, 255, 255, 0.09);
            padding: 0 16px;
            display: flex;
            flex-direction: column;
            gap: 12px;
            transition: padding 0.32s cubic-bezier(0.4, 0, 0.2, 1);
          }

          #menu:checked ~ .mobile-sheet .mobile-sheet-content {
            padding: 16px;
          }

          .mobile-link {
            color: #ffffff;
            font-size: 15px;
            font-weight: 400;
            padding: 8px 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          }

          .mobile-cta {
            height: 40px;
            border-radius: 11px;
            background: linear-gradient(180deg, #3d3d3f 0%, #1d1d20 100%);
            color: #ffffff;
            font-size: 15px;
            font-weight: 520;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-top: 4px;
          }

          .hero-h1 {
            width: 100%;
            max-width: 15ch;
            font-size: clamp(29px, 7.6vw, 50px);
            line-height: 1.14;
            letter-spacing: -0.012em;
          }

          .composer-card {
            width: 100%;
            max-width: 600px;
            height: auto;
            margin-right: 0;
            display: flex;
            flex-direction: column;
            gap: clamp(16px, 4.6vh, 34px);
            padding: clamp(13px, 3.4vw, 18px);
          }

          .composer-ph {
            position: static;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            font-size: clamp(9.4px, 2.95vw, 14px);
          }

          .composer-tools {
            position: static;
            height: auto;
            display: flex;
            flex-direction: column;
            align-items: stretch;
            gap: 12px;
          }

          .composer-chips {
            flex-wrap: wrap;
            gap: 6px;
          }

          .composer-chip {
            width: auto !important;
            height: 30px;
            padding: 0 10px !important;
            font-size: 11px;
          }

          .composer-right {
            position: static;
            display: flex;
            align-items: center;
            justify-content: flex-start;
            pointer-events: auto;
          }

          .composer-right > * {
            position: static;
          }

          .composer-model {
            font-size: 12px;
          }

          .composer-attach {
            margin-left: auto;
          }

          .composer-send {
            margin-left: 14px;
            width: 40px;
            height: 40px;
          }

          .proof-wrap {
            gap: 16px;
          }

          .proof-logos {
            gap: 28px;
            flex-wrap: wrap;
            justify-content: center;
          }
        }

        /* ------------------ EXTRA SHORT SCREENS ------------------ */
        @media (max-width: 1180px) and (max-height: 560px) {
          .stage-frame {
            padding-top: 10px !important;
          }
          .hero-wrap {
            gap: 16px !important;
          }
          .hero-h1 {
            font-size: clamp(24px, 5.4vh, 34px) !important;
          }
          .proof-wrap {
            gap: 10px !important;
          }
        }
      `}</style>

      {/* STAGE */}
      <div className="stage fixed inset-0 overflow-hidden bg-[#0a0d12]">
        {/* BACKGROUND VIDEO */}
        <video
          className="stage-video absolute inset-0 w-full h-full object-cover z-0"
          autoPlay
          muted
          loop
          playsInline
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260826_124724_bc041163-d651-425f-aea3-2acc1efc2c96.mp4"
        />

        {/* STAGE FRAME */}
        <div className="stage-frame frame absolute inset-0 z-10 flex flex-col justify-between">
          <input
            type="checkbox"
            id="menu"
            className="menu-toggle hidden"
          />

          {/* HEADER / NAV */}
          <header className="nav h-[calc(43*var(--u))] flex items-center justify-between relative w-full">
            {/* BRAND */}
            <Link
              href="/auth"
              onClick={goToAuth}
              aria-label="Looma home"
              className="anim-brand flex items-center gap-[calc(var(--brand-gap)*var(--u))] text-white cursor-pointer select-none"
            >
              {/* LOGO FROM PUBLIC */}
              <div
                className="anim-mark block shrink-0 relative overflow-hidden"
                style={{
                  width: "calc(var(--mark) * var(--u))",
                  height: "calc(var(--mark) * var(--u))",
                }}
              >
                <Image
                  src="/logo.svg"
                  alt="Looma"
                  width={34}
                  height={34}
                  className="w-full h-full object-contain"
                  priority
                />
              </div>

              <span
                style={{
                  fontSize: "calc(var(--brand-fs) * var(--u))",
                  fontWeight: "var(--w-brand)",
                  letterSpacing: "var(--brand-ls)",
                  transform: "translateY(calc(1 * var(--u)))",
                  textShadow:
                    "0 calc(1 * var(--u)) calc(10 * var(--u)) rgba(0, 0, 0, 0.3)",
                  fontVariationSettings: '"opsz" 32',
                }}
              >
                Looma
              </span>
            </Link>

            {/* NAV CENTER LINKS */}
            <nav className="desktop-nav-center">
              <Link
                href="/auth"
                onClick={goToAuth}
                className="anim-link-1 text-white hover:opacity-72 transition-opacity duration-180"
                style={{
                  fontSize: "calc(var(--links-fs) * var(--u))",
                  fontWeight: "var(--w-nav)",
                  letterSpacing: "var(--nav-ls)",
                  lineHeight: 1.2,
                  textShadow:
                    "0 calc(1 * var(--u)) calc(12 * var(--u)) rgba(0, 0, 0, 0.32)",
                }}
              >
                Features
              </Link>
              <Link
                href="/auth"
                onClick={goToAuth}
                className="anim-link-2 text-white hover:opacity-72 transition-opacity duration-180"
                style={{
                  fontSize: "calc(var(--links-fs) * var(--u))",
                  fontWeight: "var(--w-nav)",
                  letterSpacing: "var(--nav-ls)",
                  lineHeight: 1.2,
                  textShadow:
                    "0 calc(1 * var(--u)) calc(12 * var(--u)) rgba(0, 0, 0, 0.32)",
                }}
              >
                Examples
              </Link>
              <Link
                href="/auth"
                onClick={goToAuth}
                className="anim-link-3 text-white hover:opacity-72 transition-opacity duration-180"
                style={{
                  fontSize: "calc(var(--links-fs) * var(--u))",
                  fontWeight: "var(--w-nav)",
                  letterSpacing: "var(--nav-ls)",
                  lineHeight: 1.2,
                  textShadow:
                    "0 calc(1 * var(--u)) calc(12 * var(--u)) rgba(0, 0, 0, 0.32)",
                }}
              >
                Pricing
              </Link>
              <Link
                href="/auth"
                onClick={goToAuth}
                className="anim-link-4 text-white hover:opacity-72 transition-opacity duration-180"
                style={{
                  fontSize: "calc(var(--links-fs) * var(--u))",
                  fontWeight: "var(--w-nav)",
                  letterSpacing: "var(--nav-ls)",
                  lineHeight: 1.2,
                  textShadow:
                    "0 calc(1 * var(--u)) calc(12 * var(--u)) rgba(0, 0, 0, 0.32)",
                }}
              >
                Docs
              </Link>
            </nav>

            {/* NAV RIGHT CTA */}
            <Link
              href="/auth"
              onClick={goToAuth}
              className="anim-cta header-cta self-start inline-flex items-center justify-center text-white hover:brightness-116 active:translate-y-[1px] transition-[filter,transform]"
              style={{
                width: "calc(var(--cta-w) * var(--u))",
                height: "calc(var(--cta-h) * var(--u))",
                borderRadius: "calc(var(--cta-r) * var(--u))",
                fontSize: "calc(var(--cta-fs) * var(--u))",
                fontWeight: "var(--w-cta)",
                letterSpacing: "var(--cta-ls)",
                marginTop: "calc((42 - 41) * var(--u))",
                background:
                  "linear-gradient(180deg, #3d3d3f 0%, #1d1d20 100%)",
                boxShadow:
                  "inset 0 calc(1 * var(--u)) 0 rgba(255, 255, 255, 0.10), 0 calc(2 * var(--u)) calc(14 * var(--u)) rgba(0, 0, 0, 0.28)",
              }}
            >
              <span
                style={{
                  transform: "translateY(calc(var(--cta-dy) * var(--u)))",
                }}
              >
                Get Started
              </span>
            </Link>

            {/* MOBILE BURGER */}
            <label
              htmlFor="menu"
              className="mobile-burger"
              aria-label="Toggle menu"
            >
              <svg
                width="17"
                height="12"
                viewBox="0 0 17 12"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              >
                <path d="M1 2h15M1 10h15" />
              </svg>
            </label>
          </header>

          {/* MOBILE MENU SHEET */}
          <div className="mobile-sheet">
            <div className="mobile-sheet-content">
              <Link href="/auth" onClick={goToAuth} className="mobile-link">
                Features
              </Link>
              <Link href="/auth" onClick={goToAuth} className="mobile-link">
                Examples
              </Link>
              <Link href="/auth" onClick={goToAuth} className="mobile-link">
                Pricing
              </Link>
              <Link href="/auth" onClick={goToAuth} className="mobile-link">
                Docs
              </Link>
              <Link href="/auth" onClick={goToAuth} className="mobile-cta">
                Get Started
              </Link>
            </div>
          </div>

          {/* MAIN HERO */}
          <main className="hero-wrap flex-1 flex flex-col items-center justify-center gap-[calc(var(--hero-gap)*var(--vu))] pb-[calc(4*var(--vu))]">
            {/* HEADLINE */}
            <h1
              className="hero-h1 anim-h1 text-white text-center"
              style={{
                fontSize: "calc(var(--h1-fs) * var(--u))",
                fontWeight: "var(--w-display)",
                lineHeight: 1.1,
                letterSpacing: "var(--display-ls)",
                textShadow:
                  "0 calc(2 * var(--u)) calc(22 * var(--u)) rgba(0, 0, 0, 0.3)",
                fontVariationSettings: '"opsz" 32',
              }}
            >
              Describe an app. We&apos;ll build it.
            </h1>

            {/* COMPOSER CARD */}
            <div
              className="composer-card card anim-card"
              role="button"
              tabIndex={0}
              onClick={goToAuth}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") goToAuth();
              }}
            >
              {/* INTERACTIVE PLACEHOLDER / TEXTAREA - REDIRECTS ON CLICK OR FOCUS */}
              <textarea
                readOnly
                rows={1}
                placeholder="Build a fintech tracking app with bank level privacy and..."
                onClick={goToAuth}
                onFocus={goToAuth}
                className="composer-ph ph anim-ph bg-transparent resize-none border-none outline-none cursor-pointer"
                style={{
                  fontFamily: "inherit",
                }}
              />

              {/* TOOLBAR STRIP */}
              <div className="composer-tools tools">
                {/* CHIPS */}
                <div className="composer-chips chips anim-chips">
                  {/* CHIP 1: Attach Screens */}
                  <button
                    type="button"
                    onClick={goToAuth}
                    className="composer-chip"
                    style={{
                      width: "calc(107 * var(--u))",
                      paddingLeft: "calc(12 * var(--u))",
                      gap: "calc(3.7 * var(--u))",
                    }}
                  >
                    <svg
                      width="calc(15.06 * var(--u))"
                      height="calc(11 * var(--u))"
                      viewBox="0 0 16 12"
                      fill="currentColor"
                      className="shrink-0"
                    >
                      <path d="M1.5 1A1.5 1.5 0 0 0 0 2.5v7A1.5 1.5 0 0 0 1.5 11h13A1.5 1.5 0 0 0 16 9.5v-7A1.5 1.5 0 0 0 14.5 1h-13zm0 1.2h13a.3.3 0 0 1 .3.3v6a.3.3 0 0 1-.3.3h-13a.3.3 0 0 1-.3-.3v-6a.3.3 0 0 1 .3-.3z" />
                    </svg>
                    <span style={{ transform: "translateY(calc(2 * var(--u)))" }}>
                      Attach Screens
                    </span>
                  </button>

                  {/* CHIP 2: Attach a Figma */}
                  <button
                    type="button"
                    onClick={goToAuth}
                    className="composer-chip"
                    style={{
                      width: "calc(108 * var(--u))",
                      paddingLeft: "calc(16 * var(--u))",
                      gap: "calc(3.9 * var(--u))",
                    }}
                  >
                    <svg
                      width="calc(11.8 * var(--u))"
                      height="calc(14 * var(--u))"
                      viewBox="0 0 12 18"
                      fill="currentColor"
                      className="shrink-0"
                    >
                      <path d="M3 0h6a3 3 0 0 1 3 3 3 3 0 0 1-3 3H3a3 3 0 0 1-3-3 3 3 0 0 1 3-3zm0 6h6a3 3 0 0 1 3 3 3 3 0 0 1-3 3H3a3 3 0 0 1-3-3 3 3 0 0 1 3-3zm0 6h3a3 3 0 0 1 3 3 3 3 0 0 1-3 3 3 3 0 0 1-3-3v-3z" />
                    </svg>
                    <span style={{ transform: "translateY(calc(2 * var(--u)))" }}>
                      Attach a Figma
                    </span>
                  </button>

                  {/* CHIP 3: Today's Theme */}
                  <button
                    type="button"
                    onClick={goToAuth}
                    className="composer-chip"
                    style={{
                      width: "calc(107 * var(--u))",
                      paddingLeft: "calc(15.8 * var(--u))",
                      gap: "calc(2.9 * var(--u))",
                    }}
                  >
                    <svg
                      width="calc(12.13 * var(--u))"
                      height="calc(12 * var(--u))"
                      viewBox="0 0 14 14"
                      fill="currentColor"
                      className="shrink-0"
                    >
                      <path d="M7 0l1.8 5.2L14 7l-5.2 1.8L7 14l-1.8-5.2L0 7l5.2-1.8z" />
                    </svg>
                    <span style={{ transform: "translateY(calc(2 * var(--u)))" }}>
                      Today&apos;s Theme
                    </span>
                  </button>
                </div>

                {/* RIGHT CLUSTER */}
                <div className="composer-right right anim-right">
                  {/* MODEL */}
                  <button
                    type="button"
                    onClick={goToAuth}
                    className="composer-model"
                  >
                    <span>Sonnet 4.5</span>
                    <svg
                      width="calc(6.8 * var(--u))"
                      height="calc(4 * var(--u))"
                      viewBox="0 0 7 4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="shrink-0"
                    >
                      <path d="M1 1l2.5 2L6 1" />
                    </svg>
                  </button>

                  {/* ATTACH PAPERCLIP */}
                  <button
                    type="button"
                    onClick={goToAuth}
                    className="composer-attach"
                    aria-label="Attach file"
                  >
                    <svg
                      width="calc(19.79 * var(--u))"
                      height="calc(19.79 * var(--u))"
                      viewBox="0 0 20 20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M15.5 8.5l-6.8 6.8a3.5 3.5 0 0 1-5-5l7.5-7.5a2.5 2.5 0 0 1 3.5 3.5l-7.5 7.5a1.5 1.5 0 0 1-2.1-2.1l6.7-6.7" />
                    </svg>
                  </button>

                  {/* SEND BUTTON */}
                  <button
                    type="button"
                    onClick={goToAuth}
                    className="composer-send send anim-send"
                    aria-label="Build it"
                  >
                    <svg
                      width="calc(11.66 * var(--u))"
                      height="calc(11.66 * var(--u))"
                      viewBox="0 0 12 12"
                      fill="none"
                      stroke="#FFFFFF"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M6 10.5V1.5M1.5 6L6 1.5L10.5 6" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </main>

          {/* FOOTER / PROOF */}
          <footer className="proof-wrap flex-none flex flex-col items-center gap-[calc(52.3*var(--vu))]">
            <p
              className="anim-proof-by"
              style={{
                fontSize: "calc(var(--by-fs) * var(--u))",
                fontWeight: "var(--w-proof)",
                letterSpacing: "var(--proof-ls)",
                color: "rgba(255, 255, 255, 0.95)",
                textShadow:
                  "0 calc(1 * var(--u)) calc(12 * var(--u)) rgba(0, 0, 0, 0.35)",
                fontVariationSettings: '"opsz" 32',
              }}
            >
              Built by engineers from
            </p>

            <div
              className="proof-logos flex items-center gap-[calc(var(--logo-gap)*var(--u))]"
              style={{
                filter:
                  "drop-shadow(0 calc(1 * var(--u)) calc(10 * var(--u)) rgba(0, 0, 0, 0.30))",
              }}
            >
              {/* GOOGLE LOGO */}
              <div
                className="anim-logo-1 text-white"
                style={{ width: "calc(96.84 * var(--u))" }}
              >
                <svg
                  viewBox="0 0 92 30"
                  fill="currentColor"
                  className="w-full h-auto"
                >
                  <path d="M12.01 23.63c-6.49 0-11.83-5.22-11.83-11.82S5.52 0 12.01 0c3.58 0 6.16 1.41 8.1 3.26l-2.29 2.29c-1.39-1.31-3.26-2.32-5.81-2.32-5.28 0-9.44 4.29-9.44 9.58s4.16 9.58 9.44 9.58c3.44 0 5.39-1.38 6.64-2.63.85-.85 1.41-2.07 1.63-3.73h-8.27v-3.23h11.45c.11.6.17 1.32.17 2.1 0 2.5-.68 5.76-2.92 8-2.2 2.27-5.02 3.5-8.67 3.5zm21.05 0c-5.64 0-10-4.34-10-10.04s4.36-10.04 10-10.04 10 4.29 10 10.04c0 5.66-4.36 10.04-10 10.04zm0-3.56c3.09 0 5.7-2.52 5.7-6.48 0-3.99-2.61-6.48-5.7-6.48-3.12 0-5.7 2.49-5.7 6.48 0 3.96 2.58 6.48 5.7 6.48zm21.6 3.56c-5.64 0-10-4.34-10-10.04s4.36-10.04 10-10.04 10 4.29 10 10.04c0 5.66-4.36 10.04-10 10.04zm0-3.56c3.09 0 5.7-2.52 5.7-6.48 0-3.99-2.61-6.48-5.7-6.48-3.12 0-5.7 2.49-5.7 6.48 0 3.96 2.58 6.48 5.7 6.48zm20.53 3.56c-5.38 0-9.64-4.7-9.64-10.04 0-5.75 4.36-10.04 9.64-10.04 3.03 0 5.27 1.36 6.67 3.03l-2.65 2.54c-.9-.85-2.19-2.01-4.02-2.01-3.48 0-5.9 2.92-5.9 6.48s2.38 6.48 5.9 6.48c2.6 0 3.86-1.36 4.47-2.28.55-.8.95-1.86 1.12-3.29h-5.59v-3.49h9.11c.08.49.15 1.06.15 1.71 0 2.68-.75 5.9-3.25 8.08-1.56 1.36-3.53 2.08-5.89 2.08zm13.7-23.01v22.38h-4.12V.62h4.12z" />
                </svg>
              </div>

              {/* CISCO LOGO */}
              <div
                className="anim-logo-2 text-white"
                style={{ width: "calc(67.29 * var(--u))" }}
              >
                <svg
                  viewBox="0 0 70 36"
                  fill="currentColor"
                  className="w-full h-auto"
                >
                  <path d="M4.8 17.2h2.8v5.8H4.8v-5.8zm7.3-5.5h2.8v11.3h-2.8V11.7zm7.3-5.8h2.8v17.1h-2.8V5.9zm7.3 5.8h2.8v11.3h-2.8V11.7zm7.3-5.8h2.8v17.1H34V5.9zm7.3 5.8h2.8v11.3h-2.8V11.7zm7.3-5.8h2.8v17.1h-2.8V5.9zm7.3 5.8h2.8v11.3h-2.8V11.7zm7.3 5.5h2.8v5.8h-2.8v-5.8zM3.6 26.9c-2.3 0-4.1 1.8-4.1 4.3 0 2.4 1.8 4.3 4.1 4.3 1.5 0 2.8-.8 3.5-2l-1.7-1c-.4.8-1 1.3-1.8 1.3-1.3 0-2.2-1-2.2-2.6s.9-2.6 2.2-2.6c.8 0 1.4.5 1.8 1.3l1.7-1c-.7-1.2-2-2-3.5-2zm8.7.2h-2.1v8.2h2.1v-8.2zm10.2 2c0-1.4-1.2-2.3-2.8-2.3-1.7 0-3 .9-3.1 2.3h1.8c.1-.5.5-.8 1.2-.8.5 0 .9.3.9.6 0 .4-.4.5-1 .6-1.9.4-2.9.9-2.9 2.4 0 1.5 1.3 2.4 2.8 2.4 1.3 0 2.3-.6 2.7-1.5h.1v1.4h1.8v-5.2zm-1.9 3.3c-.3.6-.9.9-1.5.9-.8 0-1.2-.4-1.2-1 0-.6.5-.9 1.3-1l1.4-.3v1.4zm9.5-5.6c-2.3 0-4.1 1.8-4.1 4.3 0 2.4 1.8 4.3 4.1 4.3 1.5 0 2.8-.8 3.5-2l-1.7-1c-.4.8-1 1.3-1.8 1.3-1.3 0-2.2-1-2.2-2.6s.9-2.6 2.2-2.6c.8 0 1.4.5 1.8 1.3l1.7-1c-.7-1.2-2-2-3.5-2zm11.8 0c-2.4 0-4.2 1.9-4.2 4.3s1.8 4.3 4.2 4.3 4.2-1.9 4.2-4.3-1.8-4.3-4.2-4.3zm0 1.8c1.3 0 2.2 1.1 2.2 2.5s-.9 2.5-2.2 2.5-2.2-1.1-2.2-2.5.9-2.5 2.2-2.5z" />
                </svg>
              </div>

              {/* ADOBE LOGO */}
              <div
                className="anim-logo-3 text-white"
                style={{ width: "calc(88.68 * var(--u))" }}
              >
                <svg
                  viewBox="0 0 90 22"
                  fill="currentColor"
                  className="w-full h-auto"
                >
                  <path d="M16.57 0H0v22zm3.64 0L31.18 22H24.01l-4.1-10.13H13.76zm12.72 0H48.69v22zM57.95 4.4h3.07v13.97h-3.07zm1.53-4.4c1.02 0 1.79.77 1.79 1.79s-.77 1.79-1.79 1.79-1.79-.77-1.79-1.79.77-1.79 1.79-1.79zm17.95 9.3c0-4.9-3.33-8.52-8.2-8.52-5.12 0-8.46 3.88-8.46 8.78 0 5.02 3.33 8.78 8.46 8.78 2.82 0 5.12-1.16 6.4-3.1l-2.3-1.55c-.9 1.3-2.3 2.07-4.1 2.07-2.82 0-5.02-2.07-5.28-4.64h13.33c.13-.52.15-1.3.15-1.82zm-13.46-1.55c.38-2.32 2.3-4.12 4.99-4.12s4.61 1.8 4.86 4.12zm18.85-7.75h3.07v17.84h-3.07z" />
                </svg>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}
