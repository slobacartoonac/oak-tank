var vertCode = ['attribute vec3 position;',
            'uniform mat4 Pmatrix;',
            'uniform mat4 Vmatrix;',
            'uniform mat4 Mmatrix;',
            'attribute vec3 normals;',//the color of the point
            'attribute vec2 texCoord;',
            'varying float vColor;',
            'varying float specCol;',
            'varying vec2 vTexCoord;',
			
            'void main(void) { ',//pre-built function
               'gl_Position = Pmatrix*Vmatrix*Mmatrix*vec4(position, 1.);',
               "vec4 transformedNormal4 = Mmatrix *vec4(normals, 0.);",
               "vec4 transformedNormal5 = Vmatrix*Mmatrix *vec4(normals, 0.);",
               "vec4 lv = Vmatrix*vec4(1.,0.8,0.5, 0.); lv=normalize(lv);",

               "specCol=max(0.,1.-1.3*length((vec4(0.,0.,1.,0.) - 2.*dot(vec4(0.,0.,1.,0.) , transformedNormal5)*transformedNormal5)+lv));",
               //"specCol=1-(dot(vec4(0.,0.,1.,0) , transformedNormal5)+dot(vec4(1.,1.,1.,0) , transformedNormal4));",
               "vec3 transformedNormal = vec3(transformedNormal4.x,transformedNormal4.y,transformedNormal4.z);",
               "vColor = (atan(dot(transformedNormal, normalize (vec3(1.,0.8,0.5))))+1.571)/1.8;",
               'vTexCoord=texCoord;',
            '}'].join('\n');

var fragCode = ['precision mediump float;',
            'varying float vColor;',
            'varying vec2 vTexCoord;',
            'uniform sampler2D sTexture;',
            'varying float specCol;',
            'void main(void) {',
               'gl_FragColor = texture2D(sTexture, vTexCoord)*vColor+vec4(0.,0.,0.,1.)*(1.-vColor)+vec4(0.5,0.5,0.5,0.)*specCol;',
            '}'].join('\n');