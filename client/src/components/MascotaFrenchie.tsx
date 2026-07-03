// Mascota frenchie de Punky Partners (portada del handoff, assets/mascota-frenchie.svg).
// hideEyes=true → se tapa los ojos con las patas (al enfocar el campo contraseña).
export function MascotaFrenchie({ hideEyes = false }: { hideEyes?: boolean }) {
  return (
    <svg viewBox="0 0 260 190" width="190" height="139" fill="none">
      <defs>
        <clipPath id="punky-head-clip">
          <path d="M64 122 C60 82 88 56 130 56 C172 56 200 82 196 122 C193 152 166 168 130 168 C94 168 67 152 64 122 Z" />
        </clipPath>
        <clipPath id="punky-muzzle-clip">
          <path d="M84 132 C84 112 102 106 130 106 C158 106 176 112 176 132 C176 150 163 163 144 165 C137 165.8 132 164 130 161 C128 164 123 165.8 116 165 C97 163 84 150 84 132 Z" />
        </clipPath>
      </defs>
      <g style={{ animation: 'headTilt 5.2s ease-in-out infinite', transformOrigin: '130px 168px' }}>
        {/* orejas grandes redondeadas, inclinadas hacia afuera */}
        <g style={{ animation: 'earTwitch 5.2s ease-in-out infinite', transformOrigin: '80px 76px' }}>
          <ellipse cx="76" cy="46" rx="25" ry="36" fill="#66696C" stroke="#2E2A28" strokeWidth="5.5" transform="rotate(-24 76 46)" />
        </g>
        <ellipse cx="184" cy="44" rx="26" ry="38" fill="#66696C" stroke="#2E2A28" strokeWidth="5.5" transform="rotate(24 184 44)" />
        {/* cabeza en huevo, gris con franja blanca */}
        <path d="M64 122 C60 82 88 56 130 56 C172 56 200 82 196 122 C193 152 166 168 130 168 C94 168 67 152 64 122 Z" fill="#66696C" stroke="#2E2A28" strokeWidth="5.5" />
        <g clipPath="url(#punky-head-clip)">
          <path d="M112 52 C112 74 108 88 100 98 C94 106 88 112 84 119 C96 128 116 131 131 129 C133 104 133 76 131 52 Z" fill="#FFFFFF" />
        </g>
        {/* hocico grande y bajo con jowls */}
        <path d="M84 132 C84 112 102 106 130 106 C158 106 176 112 176 132 C176 150 163 163 144 165 C137 165.8 132 164 130 161 C128 164 123 165.8 116 165 C97 163 84 150 84 132 Z" fill="#FFFFFF" />
        <g clipPath="url(#punky-muzzle-clip)">
          <ellipse cx="166" cy="136" rx="28" ry="32" fill="#66696C" />
        </g>
        <path d="M84 132 C84 112 102 106 130 106 C158 106 176 112 176 132 C176 150 163 163 144 165 C137 165.8 132 164 130 161 C128 164 123 165.8 116 165 C97 163 84 150 84 132 Z" fill="none" stroke="#2E2A28" strokeWidth="5.5" />
        {/* arruga entre los ojos */}
        <path d="M119 99 Q130 94.5 141 99" stroke="#2E2A28" strokeWidth="3.5" strokeLinecap="round" />
        {/* nariz grande */}
        <path d="M117 110 C121 105.5 139 105.5 143 110 C147.5 114.5 147.5 123 142 127 C136.5 131 123.5 131 118 127 C112.5 123 112.5 114.5 117 110 Z" fill="#26221F" />
        <circle cx="123" cy="113" r="2" fill="#FFFFFF" opacity=".5" />
        <path d="M130 130 L130 140" stroke="#2E2A28" strokeWidth="4" strokeLinecap="round" />
        {/* boquita abierta con lengüita */}
        <path d="M111 139 Q120 138 128 140 Q126 150 116 149.5 Q109 146 111 139 Z" fill="#26221F" />
        <path d="M114.5 142.5 Q119 141.5 123.5 143 Q122.5 148 117.5 147.5 Q114.5 145.5 114.5 142.5 Z" fill="#F5A9BB" />
        {/* ojos (se ocultan al escribir la contraseña) */}
        <g style={{ display: hideEyes ? 'none' : 'block' }}>
          <circle cx="92" cy="104" r="7" fill="#26221F" />
          <circle cx="94.2" cy="101.6" r="2.4" fill="#FFFFFF" />
          <circle cx="168" cy="104" r="7" fill="#26221F" />
          <circle cx="170.2" cy="101.6" r="2.4" fill="#FFFFFF" />
          <g style={{ animation: 'browRaise 5.2s ease-in-out infinite', transformOrigin: '92px 92px' }}>
            <path d="M86 96 L81.5 90.5 M92 94 L90 87.5 M98 95 L99 88" stroke="#2E2A28" strokeWidth="3.5" strokeLinecap="round" />
          </g>
        </g>
        {/* patitas tapando los ojos */}
        <g style={{ display: hideEyes ? 'block' : 'none' }}>
          <g transform="rotate(-12 92 104)">
            <rect x="73" y="88" width="38" height="31" rx="15.5" fill="#FFFFFF" stroke="#2E2A28" strokeWidth="5" />
            <path d="M84 94v13M93 94v13M102 94v13" stroke="#2E2A28" strokeWidth="3" strokeLinecap="round" />
          </g>
          <g transform="rotate(12 168 104)">
            <rect x="149" y="88" width="38" height="31" rx="15.5" fill="#FFFFFF" stroke="#2E2A28" strokeWidth="5" />
            <path d="M160 94v13M169 94v13M178 94v13" stroke="#2E2A28" strokeWidth="3" strokeLinecap="round" />
          </g>
        </g>
      </g>
      {/* patitas sobre el borde (bajan cuando se tapa los ojos) */}
      <g style={{ display: hideEyes ? 'none' : 'block' }}>
        <rect x="74" y="145" width="34" height="28" rx="14" fill="#FFFFFF" stroke="#2E2A28" strokeWidth="5" />
        <rect x="152" y="145" width="34" height="28" rx="14" fill="#FFFFFF" stroke="#2E2A28" strokeWidth="5" />
        <path d="M85 151v12M96 151v12M163 151v12M174 151v12" stroke="#2E2A28" strokeWidth="3" strokeLinecap="round" />
      </g>
    </svg>
  )
}
