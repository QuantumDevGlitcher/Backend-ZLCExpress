@echo off
echo =========================================
echo    CREANDO USUARIOS REALES EN POSTGRESQL
echo =========================================
echo.

echo 🔗 Conectando al backend en http://localhost:3000
echo.

echo 📝 Registrando usuario: admin@zlcexpress.com
powershell -Command "try { $response = Invoke-RestMethod -Uri 'http://localhost:3000/api/auth/register' -Method POST -Headers @{'Content-Type'='application/json'} -Body '{\"email\":\"admin@zlcexpress.com\",\"password\":\"admin123\",\"companyName\":\"ZLC Express Corp\",\"taxId\":\"900123456-1\",\"operationCountry\":\"Colombia\",\"industry\":\"Logística y Transporte\",\"contactName\":\"Carlos Administrador\",\"contactPosition\":\"CEO\",\"contactPhone\":\"+57 1 234 5678\",\"fiscalAddress\":\"Carrera 7 #12-34, Oficina 501\",\"country\":\"Colombia\",\"state\":\"Bogotá DC\",\"city\":\"Bogotá\",\"postalCode\":\"110111\",\"userType\":\"both\"}'; Write-Host '✅ Admin registrado:' $response.message } catch { Write-Host '❌ Error:' $_.Exception.Message }"
echo.

echo 📝 Registrando usuario: comprador@empresa.com
powershell -Command "try { $response = Invoke-RestMethod -Uri 'http://localhost:3000/api/auth/register' -Method POST -Headers @{'Content-Type'='application/json'} -Body '{\"email\":\"comprador@empresa.com\",\"password\":\"comprador123\",\"companyName\":\"Importadora Los Andes S.A.S\",\"taxId\":\"900234567-2\",\"operationCountry\":\"Colombia\",\"industry\":\"Comercio Internacional\",\"contactName\":\"María Compradora\",\"contactPosition\":\"Gerente de Compras\",\"contactPhone\":\"+57 300 123 4567\",\"fiscalAddress\":\"Calle 100 #15-20, Torre A\",\"country\":\"Colombia\",\"state\":\"Bogotá DC\",\"city\":\"Bogotá\",\"postalCode\":\"110221\",\"userType\":\"buyer\"}'; Write-Host '✅ Comprador registrado:' $response.message } catch { Write-Host '❌ Error:' $_.Exception.Message }"
echo.

echo 📝 Registrando usuario: proveedor@fabrica.com
powershell -Command "try { $response = Invoke-RestMethod -Uri 'http://localhost:3000/api/auth/register' -Method POST -Headers @{'Content-Type'='application/json'} -Body '{\"email\":\"proveedor@fabrica.com\",\"password\":\"proveedor123\",\"companyName\":\"Manufactura Global Ltda\",\"taxId\":\"900345678-3\",\"operationCountry\":\"Colombia\",\"industry\":\"Manufactura\",\"contactName\":\"Juan Proveedor\",\"contactPosition\":\"Director Comercial\",\"contactPhone\":\"+57 310 987 6543\",\"fiscalAddress\":\"Zona Industrial Calle 80 #45-67\",\"country\":\"Colombia\",\"state\":\"Cundinamarca\",\"city\":\"Mosquera\",\"postalCode\":\"250040\",\"userType\":\"supplier\"}'; Write-Host '✅ Proveedor registrado:' $response.message } catch { Write-Host '❌ Error:' $_.Exception.Message }"
echo.

echo 📝 Registrando usuario: juan@empresa.com
powershell -Command "try { $response = Invoke-RestMethod -Uri 'http://localhost:3000/api/auth/register' -Method POST -Headers @{'Content-Type'='application/json'} -Body '{\"email\":\"juan@empresa.com\",\"password\":\"password123\",\"companyName\":\"Juan Mock Enterprises\",\"taxId\":\"900567890-5\",\"operationCountry\":\"Colombia\",\"industry\":\"Tecnología\",\"contactName\":\"Juan Mock Moreno\",\"contactPosition\":\"Founder & CEO\",\"contactPhone\":\"+57 315 444 5555\",\"fiscalAddress\":\"Carrera 15 #93-47\",\"country\":\"Colombia\",\"state\":\"Bogotá DC\",\"city\":\"Bogotá\",\"postalCode\":\"110221\",\"userType\":\"buyer\"}'; Write-Host '✅ Juan registrado:' $response.message } catch { Write-Host '❌ Error:' $_.Exception.Message }"
echo.

echo 📝 Registrando usuario: pendiente@empresa.com
powershell -Command "try { $response = Invoke-RestMethod -Uri 'http://localhost:3000/api/auth/register' -Method POST -Headers @{'Content-Type'='application/json'} -Body '{\"email\":\"pendiente@empresa.com\",\"password\":\"pendiente123\",\"companyName\":\"Nueva Empresa S.A.S\",\"taxId\":\"900456789-4\",\"operationCountry\":\"Colombia\",\"industry\":\"Comercio\",\"contactName\":\"Ana Pendiente\",\"contactPosition\":\"Gerente General\",\"contactPhone\":\"+57 320 555 7890\",\"fiscalAddress\":\"Avenida 68 #25-30\",\"country\":\"Colombia\",\"state\":\"Bogotá DC\",\"city\":\"Bogotá\",\"postalCode\":\"110411\",\"userType\":\"buyer\"}'; Write-Host '✅ Usuario pendiente registrado:' $response.message } catch { Write-Host '❌ Error:' $_.Exception.Message }"
echo.

echo =========================================
echo          USUARIOS CREADOS
echo =========================================
echo.
echo 📋 Credenciales para login:
echo ┌─────────────────────────────┬─────────────────┬──────────────┐
echo │ Email                       │ Password        │ Tipo         │
echo ├─────────────────────────────┼─────────────────┼──────────────┤
echo │ admin@zlcexpress.com        │ admin123        │ both         │
echo │ comprador@empresa.com       │ comprador123    │ buyer        │
echo │ proveedor@fabrica.com       │ proveedor123    │ supplier     │
echo │ juan@empresa.com            │ password123     │ buyer        │
echo │ pendiente@empresa.com       │ pendiente123    │ buyer        │
echo └─────────────────────────────┴─────────────────┴──────────────┘
echo.
echo 🎯 Ahora puedes usar estas credenciales en el frontend!
echo 🗄️ Todos los usuarios están guardados en PostgreSQL
echo.
pause
