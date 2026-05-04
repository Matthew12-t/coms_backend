const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'COMS Backend API',
    version: '1.0.0',
    description: 'API untuk aplikasi COMS — monitoring kepadatan kantin kampus.',
  },
  servers: [
    {
      url: 'https://web-production-e34ad.up.railway.app',
      description: 'Production',
    },
    {
      url: 'http://localhost:3000',
      description: 'Local',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      deviceKey: {
        type: 'apiKey',
        in: 'header',
        name: 'x-device-key',
      },
    },
    schemas: {
      Error: {
        type: 'object',
        properties: {
          error: { type: 'string' },
        },
      },
      Session: {
        type: 'object',
        properties: {
          user: { type: 'object' },
          session: {
            type: 'object',
            properties: {
              access_token: { type: 'string' },
              refresh_token: { type: 'string' },
              expires_in: { type: 'integer' },
            },
          },
        },
      },
      Profile: {
        type: 'object',
        properties: {
          full_name: { type: 'string', nullable: true },
          student_id: { type: 'string', nullable: true },
          major: { type: 'string', nullable: true },
        },
      },
      Canteen: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          name: { type: 'string' },
          capacity_max: { type: 'integer' },
        },
      },
      OccupancyLog: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          canteen_id: { type: 'integer' },
          head_count: { type: 'integer' },
          created_at: { type: 'string', format: 'date-time' },
        },
      },
      OccupancyLatest: {
        type: 'object',
        properties: {
          canteen_id: { type: 'integer' },
          name: { type: 'string' },
          head_count: { type: 'integer' },
          capacity_max: { type: 'integer' },
          density_level: {
            type: 'string',
            enum: ['low', 'moderate', 'peak'],
          },
          created_at: { type: 'string', format: 'date-time', nullable: true },
        },
      },
    },
  },
  paths: {
    '/health': {
      get: {
        tags: ['Health'],
        summary: 'Cek status server',
        responses: {
          200: {
            description: 'Server berjalan normal',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { status: { type: 'string', example: 'ok' } },
                },
              },
            },
          },
        },
      },
    },
    '/api/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Daftar akun baru',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string' },
                  redirectTo: { type: 'string', format: 'uri' },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Registrasi berhasil, email verifikasi dikirim',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { data: { $ref: '#/components/schemas/Session' } },
                },
              },
            },
          },
          400: { description: 'Validasi gagal atau email sudah terdaftar', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
    },
    '/api/auth/verify-email': {
      post: {
        tags: ['Auth'],
        summary: 'Verifikasi email dengan token OTP',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['token_hash', 'type'],
                properties: {
                  token_hash: { type: 'string' },
                  type: { type: 'string', example: 'email' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Email berhasil diverifikasi',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { data: { $ref: '#/components/schemas/Session' } },
                },
              },
            },
          },
          400: { description: 'Token tidak valid', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
    },
    '/api/auth/exchange-code': {
      post: {
        tags: ['Auth'],
        summary: 'Tukar authorization code menjadi session',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['code'],
                properties: {
                  code: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Session berhasil dibuat',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { data: { $ref: '#/components/schemas/Session' } },
                },
              },
            },
          },
          400: { description: 'Code tidak valid', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
    },
    '/api/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Login dengan email dan password',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Login berhasil',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { data: { $ref: '#/components/schemas/Session' } },
                },
              },
            },
          },
          401: { description: 'Email atau password salah', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
    },
    '/api/auth/logout': {
      post: {
        tags: ['Auth'],
        summary: 'Logout dan invalidate session',
        responses: {
          204: { description: 'Logout berhasil' },
        },
      },
    },
    '/api/auth/me': {
      get: {
        tags: ['Auth'],
        summary: 'Ambil data user yang sedang login',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Data user',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { data: { type: 'object' } },
                },
              },
            },
          },
          401: { description: 'Token tidak valid atau tidak ada', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
    },
    '/api/profile': {
      get: {
        tags: ['Profile'],
        summary: 'Ambil profil pengguna',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Data profil',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { data: { $ref: '#/components/schemas/Profile' } },
                },
              },
            },
          },
          401: { description: 'Tidak terautentikasi', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
      put: {
        tags: ['Profile'],
        summary: 'Buat atau update profil pengguna',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['full_name', 'student_id', 'major'],
                properties: {
                  full_name: { type: 'string' },
                  student_id: { type: 'string' },
                  major: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Profil berhasil disimpan',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { data: { $ref: '#/components/schemas/Profile' } },
                },
              },
            },
          },
          400: { description: 'Validasi gagal', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          401: { description: 'Tidak terautentikasi', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
    },
    '/api/canteens': {
      get: {
        tags: ['Canteens'],
        summary: 'Ambil daftar semua kantin',
        responses: {
          200: {
            description: 'Daftar kantin',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: { type: 'array', items: { $ref: '#/components/schemas/Canteen' } },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/api/canteens/{id}': {
      get: {
        tags: ['Canteens'],
        summary: 'Ambil detail kantin berdasarkan ID',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } },
        ],
        responses: {
          200: {
            description: 'Detail kantin',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { data: { $ref: '#/components/schemas/Canteen' } },
                },
              },
            },
          },
          404: { description: 'Kantin tidak ditemukan', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
    },
    '/api/canteens/{canteen_id}/history': {
      get: {
        tags: ['Canteens'],
        summary: 'Riwayat log kepadatan suatu kantin',
        parameters: [
          { name: 'canteen_id', in: 'path', required: true, schema: { type: 'integer' } },
          { name: 'limit', in: 'query', required: false, schema: { type: 'integer', default: 100 } },
        ],
        responses: {
          200: {
            description: 'Riwayat kepadatan',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: { type: 'array', items: { $ref: '#/components/schemas/OccupancyLog' } },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/api/occupancy/latest': {
      get: {
        tags: ['Occupancy'],
        summary: 'Kepadatan terbaru semua kantin',
        responses: {
          200: {
            description: 'Status kepadatan real-time',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: { type: 'array', items: { $ref: '#/components/schemas/OccupancyLatest' } },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/api/occupancy': {
      post: {
        tags: ['Occupancy'],
        summary: 'Catat data kepadatan kantin',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['canteen_id', 'head_count'],
                properties: {
                  canteen_id: { type: 'integer' },
                  head_count: { type: 'number' },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Log berhasil dicatat',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { data: { $ref: '#/components/schemas/OccupancyLog' } },
                },
              },
            },
          },
          400: { description: 'Validasi gagal', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
    },
    '/api/predictions': {
      post: {
        tags: ['Predictions'],
        summary: 'Kirim hasil prediksi dari AI/device',
        security: [{ deviceKey: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['canteen_id', 'head_count'],
                properties: {
                  canteen_id: { type: 'integer' },
                  head_count: { type: 'number' },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Prediksi berhasil dicatat',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { data: { $ref: '#/components/schemas/OccupancyLog' } },
                },
              },
            },
          },
          400: { description: 'Validasi gagal', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          401: { description: 'Device key tidak valid', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
    },
    '/api/preferences': {
      get: {
        tags: ['Preferences'],
        summary: 'Ambil daftar kantin favorit pengguna',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Daftar kantin favorit',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: {
                      type: 'object',
                      properties: {
                        favorite_canteen_ids: { type: 'array', items: { type: 'integer' } },
                      },
                    },
                  },
                },
              },
            },
          },
          401: { description: 'Tidak terautentikasi', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
      put: {
        tags: ['Preferences'],
        summary: 'Update daftar kantin favorit (replace semua)',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['favorite_canteen_ids'],
                properties: {
                  favorite_canteen_ids: { type: 'array', items: { type: 'integer' } },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Preferensi berhasil disimpan',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: {
                      type: 'object',
                      properties: {
                        favorite_canteen_ids: { type: 'array', items: { type: 'integer' } },
                      },
                    },
                  },
                },
              },
            },
          },
          400: { description: 'Profil/NIM belum diisi', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          401: { description: 'Tidak terautentikasi', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
    },
    '/api/analytics/peak-hours': {
      get: {
        tags: ['Analytics'],
        summary: 'Data jam puncak kepadatan kantin',
        parameters: [
          { name: 'canteen_id', in: 'query', required: false, schema: { type: 'integer' } },
          { name: 'range', in: 'query', required: false, schema: { type: 'string' } },
        ],
        responses: {
          200: {
            description: 'Data jam puncak',
            content: {
              'application/json': {
                schema: { type: 'object', properties: { data: { type: 'array', items: { type: 'object' } } } },
              },
            },
          },
        },
      },
    },
    '/api/analytics/daily-averages': {
      get: {
        tags: ['Analytics'],
        summary: 'Rata-rata kepadatan harian per kantin',
        parameters: [
          { name: 'canteen_id', in: 'query', required: false, schema: { type: 'integer' } },
        ],
        responses: {
          200: {
            description: 'Data rata-rata harian',
            content: {
              'application/json': {
                schema: { type: 'object', properties: { data: { type: 'array', items: { type: 'object' } } } },
              },
            },
          },
        },
      },
    },
    '/api/analytics/recommendations': {
      get: {
        tags: ['Analytics'],
        summary: 'Rekomendasi kantin terbaik berdasarkan lokasi dan kepadatan',
        parameters: [
          { name: 'lat', in: 'query', required: false, schema: { type: 'number' } },
          { name: 'lng', in: 'query', required: false, schema: { type: 'number' } },
        ],
        responses: {
          200: {
            description: 'Rekomendasi kantin',
            content: {
              'application/json': {
                schema: { type: 'object', properties: { data: { type: 'array', items: { type: 'object' } } } },
              },
            },
          },
        },
      },
    },
    '/api/menus': {
      get: {
        tags: ['Menus'],
        summary: 'Daftar menu (belum diimplementasikan)',
        responses: {
          200: {
            description: 'Mengembalikan array kosong',
            content: {
              'application/json': {
                schema: { type: 'object', properties: { data: { type: 'array', items: {} } } },
              },
            },
          },
        },
      },
      post: {
        tags: ['Menus'],
        summary: 'Tambah menu (belum diimplementasikan)',
        responses: {
          501: { description: 'Fitur belum tersedia', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
    },
  },
};

module.exports = swaggerDocument;
