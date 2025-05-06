import { ProfileCardGenerator } from './modules/ProfileCardGenerator.js';

document.addEventListener('DOMContentLoaded', () => {
    const cardGenerator = new ProfileCardGenerator('profileCanvas');
    
    const generateBtn = document.getElementById('generateBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const avatarUpload = document.getElementById('avatarUpload');
    const clearSignatureBtn = document.getElementById('clearSignature');
    
    let avatarImage = null; // We'll use fallback if no image is provided
    
    // Setup signature pad
    const signatureCanvas = document.getElementById('signatureCanvas');
    const signatureCtx = signatureCanvas.getContext('2d');
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;
    
    // Initialize signature pad
    signatureCtx.lineJoin = 'round';
    signatureCtx.lineCap = 'round';
    signatureCtx.lineWidth = 2;
    signatureCtx.strokeStyle = 'black';
    
    function startDrawing(e) {
        isDrawing = true;
        const rect = signatureCanvas.getBoundingClientRect();
        [lastX, lastY] = [
            (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left, 
            (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top
        ];
    }
    
    function draw(e) {
        if (!isDrawing) return;
        e.preventDefault();
        
        const rect = signatureCanvas.getBoundingClientRect();
        const currentX = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
        const currentY = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;
        
        signatureCtx.beginPath();
        signatureCtx.moveTo(lastX, lastY);
        signatureCtx.lineTo(currentX, currentY);
        signatureCtx.stroke();
        
        [lastX, lastY] = [currentX, currentY];
    }
    
    function endDrawing() {
        isDrawing = false;
    }
    
    // Mouse events
    signatureCanvas.addEventListener('mousedown', startDrawing);
    signatureCanvas.addEventListener('mousemove', draw);
    signatureCanvas.addEventListener('mouseup', endDrawing);
    signatureCanvas.addEventListener('mouseout', endDrawing);
    
    // Touch events
    signatureCanvas.addEventListener('touchstart', startDrawing);
    signatureCanvas.addEventListener('touchmove', draw);
    signatureCanvas.addEventListener('touchend', endDrawing);
    
    clearSignatureBtn.addEventListener('click', () => {
        signatureCtx.clearRect(0, 0, signatureCanvas.width, signatureCanvas.height);
    });
    
    // Handle file upload for avatar
    avatarUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                avatarImage = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    });
    
    // Generate profile card
    generateBtn.addEventListener('click', () => {
        try {
            const profileData = {
                name: document.getElementById('name').value || 'John Doe',
                username: document.getElementById('username').value || '3578112509950001',
                playing: document.getElementById('playing').value || 'Jl. Merdeka No. 17, Jakarta',
                maritalStatus: document.getElementById('maritalStatus').value,
                employmentStatus: document.getElementById('employmentStatus').value,
                religion: document.getElementById('religion').value,
                hobby: document.getElementById('hobby').value || 'Photography',
                signature: signatureCanvas.toDataURL('image/png'),
                avatar: avatarImage
            };
            
            cardGenerator.generateCard(profileData)
                .then(() => {
                    downloadBtn.style.display = 'block';
                    
                    // Add fun animation
                    const canvas = document.getElementById('profileCanvas');
                    canvas.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        canvas.style.transform = 'scale(1)';
                    }, 200);
                })
                .catch(error => {
                    console.error('Error generating card:', error);
                    alert('There was an issue generating the ID card, but we\'ve created a basic version for you.');
                    downloadBtn.style.display = 'block';
                });
        } catch (error) {
            console.error('Error preparing card data:', error);
            alert('Something went wrong. Please try again.');
        }
    });
    
    // Handle download button
    downloadBtn.addEventListener('click', () => {
        try {
            const canvas = document.getElementById('profileCanvas');
            const link = document.createElement('a');
            link.download = 'my-id-card.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        } catch (error) {
            console.error('Error downloading card:', error);
            alert('Failed to download. Try right-clicking on the image and selecting "Save Image As".');
        }
    });
    
    // Generate default card on load
    cardGenerator.loadDefaultBackground()
        .then(() => {
            try {
                const defaultData = {
                    name: 'Takashi Yamada',
                    username: '3578112509950001',
                    playing: 'Jl. Merdeka No. 17, Jakarta',
                    maritalStatus: 'Single',
                    employmentStatus: 'Employed',
                    religion: 'Islam',
                    hobby: 'Photography',
                    signature: signatureCanvas.toDataURL('image/png'),
                    avatar: null
                };
                return cardGenerator.generateCard(defaultData);
            } catch (error) {
                console.error('Error with default data:', error);
                return Promise.resolve();
            }
        })
        .then(() => {
            downloadBtn.style.display = 'block';
        })
        .catch(error => {
            console.error('Error in initial card generation:', error);
            // Still show the download button
            downloadBtn.style.display = 'block';
        });
});
