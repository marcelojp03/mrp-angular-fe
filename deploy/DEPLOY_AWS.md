# ☁️ DESPLIEGUE A AWS S3 - MRP Angular

## � Despliegue Automático (Recomendado)

### Opción 1: Usando npm script
```bash
npm run deploy
```

### Opción 2: Script directo
```powershell
.\deploy-to-s3.ps1
```

### Opción 3: Despliegue rápido (sin build)
```bash
npm run deploy:quick
```

---

## 📋 Configuración Inicial (Solo Primera Vez)

### 1. Configurar bucket como sitio web estático
```powershell
aws s3 website s3://si2-mrp-fe --index-document index.html --error-document index.html --region us-east-1
```

### 2. Desactivar "Block Public Access"
```powershell
aws s3api put-public-access-block --bucket si2-mrp-fe --region us-east-1 --public-access-block-configuration "BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false"
```

### 3. Aplicar política de acceso público
```powershell
aws s3api put-bucket-policy --bucket si2-mrp-fe --region us-east-1 --policy file://bucket-policy.json
```

---

## 📦 Comandos Manuales (Paso a Paso)

### 1. Compilar para producción
```bash
npm run build:prod
```

### 2. Subir assets estáticos (JS, CSS, imágenes) - Cache 1 año
```powershell
aws s3 sync dist/erp-fe-sakai/browser s3://si2-mrp-fe --region us-east-1 --delete --cache-control "public,max-age=31536000" --exclude "*.html" --exclude "*.json"
```

### 3. Subir HTML y JSON - Sin cache
```powershell
aws s3 sync dist/erp-fe-sakai/browser s3://si2-mrp-fe --region us-east-1 --exclude "*" --include "*.html" --include "*.json" --cache-control "public,max-age=0,must-revalidate"
```

---

## 🌐 URLs de Acceso

**S3 Website Endpoint:**
```
http://si2-mrp-fe.s3-website-us-east-1.amazonaws.com
```

**S3 Direct Access:**
```
https://si2-mrp-fe.s3.us-east-1.amazonaws.com/index.html
```

---

## ⚙️ Configuración de Environments

✅ **Ya configurado:** El archivo `angular.json` ahora tiene `fileReplacements` para cambiar automáticamente:
- **Desarrollo:** Usa `environment.ts` (localhost:4646)
- **Producción:** Usa `environment.prod.ts` (AWS App Runner)

### Verificar configuración actual:

**Desarrollo (environment.ts):**
- Backend: `http://localhost:4646/api`
- OAuth: `http://localhost:8585/api`

**Producción (environment.prod.ts):**
- Backend: `https://bmf8h9p2pz.us-east-1.awsapprunner.com/api`
- OAuth: `https://207.244.229.255:8510/api`

---

## 📝 Notas importantes:

1. **Cache Strategy:**
   - Archivos estáticos (JS, CSS): Cache de 1 año
   - index.html: Sin caché (para actualizaciones inmediatas)

2. **Angular Routing:**
   - Configurado `ErrorDocument: index.html` para que las rutas de Angular funcionen

3. **Primera vez:**
   - Ejecutar comandos 5, 6 y 7 para configurar el bucket
   - Después solo necesitas los comandos 1-4

4. **Actualizaciones:**
   - Solo ejecuta el script `deploy-to-s3.ps1` o comandos 1-4
