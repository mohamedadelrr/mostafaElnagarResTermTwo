// تعطيل النقر بزر الفأرة الأيمن
document.addEventListener('contextmenu', function(event) {
    event.preventDefault();
});

// تعطيل مفاتيح الاختصار (Ctrl+U, Ctrl+I, Ctrl+J)
document.addEventListener('keydown', function(event) {
    if (event.ctrlKey && (event.keyCode === 85 || event.keyCode === 73 || event.keyCode === 74)) {
        event.preventDefault();
    }
});

// التحكم في تشغيل/إيقاف الموسيقى
const musicToggle = document.getElementById('musicToggle');
const backgroundMusic = document.getElementById('backgroundMusic');
let isMusicPlaying = false;

document.addEventListener('DOMContentLoaded', function() {
    // تشغيل الموسيقى تلقائيًا عند تحميل الصفحة (مرة واحدة فقط)
    const playMusic = () => {
        backgroundMusic.play()
            .then(() => {
                isMusicPlaying = true;
                musicToggle.innerHTML = '<i class="fas fa-music"></i>';
            })
            .catch(error => {
                console.log('تشغيل الموسيقى تلقائيًا غير مدعوم في هذا المتصفح.');
                isMusicPlaying = false;
                musicToggle.innerHTML = '<i class="fas fa-music-slash"></i>';
            });
    };

    // تشغيل الموسيقى عند أول تفاعل مع الصفحة
    document.body.addEventListener('click', () => {
        if (!isMusicPlaying) {
            playMusic();
        }
    }, { once: true });

    // تبديل حالة الموسيقى عند النقر على زر التحكم
    musicToggle.addEventListener('click', function(event) {
        event.stopPropagation();
        if (isMusicPlaying) {
            backgroundMusic.pause();
            musicToggle.innerHTML = '<i class="fas fa-music-slash"></i>';
        } else {
            backgroundMusic.play();
            musicToggle.innerHTML = '<i class="fas fa-music"></i>';
        }
        isMusicPlaying = !isMusicPlaying;
    });
});

// معالجة إرسال نموذج تسجيل الدخول
document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const seatNumber = document.getElementById('seatNumber').value;
    const errorMessage = document.getElementById('errorMessage');

    try {
        console.log('Attempting to fetch data from /json/std.json');
        const response = await fetch('std.json');
        console.log('Fetch response:', response);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status} - ${response.statusText}`);
        }
        const data = await response.json();
        console.log('Data fetched successfully:', data);

        let student = null;
        for (const grade in data) {
            const students = data[grade];
            student = students.find(s => s['الرقم القومي'] == seatNumber);
            if (student) break;
        }

        if (student) {
            console.log('Student found:', student);
            localStorage.setItem('studentResult', JSON.stringify(student));
            window.location.href = 'result.html';
        } else {
            console.log('Student not found for seat number:', seatNumber);
            errorMessage.textContent = 'رقم الجلوس غير صحيح';
            errorMessage.classList.add('animate__animated', 'animate__shakeX');
            setTimeout(() => {
                errorMessage.classList.remove('animate__animated', 'animate__shakeX');
            }, 1000);
        }
    } catch (error) {
        console.error('Error fetching std.json:', error);
        errorMessage.textContent = 'حدث خطأ أثناء جلب البيانات';
        errorMessage.classList.add('animate__animated', 'animate__shakeX');
        setTimeout(() => {
            errorMessage.classList.remove('animate__animated', 'animate__shakeX');
        }, 1000);
    }
});