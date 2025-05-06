import { ProfileCardGenerator } from '/ProfileCardGenerator.js';

document.addEventListener('DOMContentLoaded', () => {
    const cardGenerator = new ProfileCardGenerator('profileCanvas');
    
    const generateBtn = document.getElementById('generateBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const resetBtn = document.getElementById('resetBtn');
    const avatarUpload = document.getElementById('avatarUpload');
    const clearSignatureBtn = document.getElementById('clearSignature');
    const loadingOverlay = document.getElementById('loadingOverlay');
    const fileUploadBtn = document.querySelector('.file-upload-btn');
    const fileNameDisplay = document.querySelector('.file-name');
    
    let avatarImage = null; // We'll use fallback if no image is provided
    
    // Setup signature pad
    const signatureCanvas = document.getElementById('signatureCanvas');
    const signatureCtx = signatureCanvas.getContext('2d');
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;
    
    // Initialize signature pad
    initSignaturePad();
    
    // Show loading overlay
    function showLoading() {
        loadingOverlay.classList.add('active');
    }
    
    // Hide loading overlay
    function hideLoading() {
        loadingOverlay.classList.remove('active');
    }
    
    // Initialize signature pad
    function initSignaturePad() {
        signatureCtx.lineJoin = 'round';
        signatureCtx.lineCap = 'round';
        signatureCtx.lineWidth = 2;
        signatureCtx.strokeStyle = 'black';
        signatureCtx.clearRect(0, 0, signatureCanvas.width, signatureCanvas.height);
        
        // Add light gray background with text
        signatureCtx.fillStyle = '#f9f9f9';
        signatureCtx.fillRect(0, 0, signatureCanvas.width, signatureCanvas.height);
        signatureCtx.fillStyle = '#cccccc';
        signatureCtx.font = 'italic 16px Arial, sans-serif';
        signatureCtx.textAlign = 'center';
        signatureCtx.fillText('Sign Here', signatureCanvas.width/2, signatureCanvas.height/2);
        signatureCtx.textAlign = 'left';
    }
    
    function startDrawing(e) {
        isDrawing = true;
        
        // Clear the hint text on first drawing
        if (e.type === 'mousedown' || e.type === 'touchstart') {
            signatureCtx.clearRect(0, 0, signatureCanvas.width, signatureCanvas.height);
            signatureCtx.fillStyle = 'white';
            signatureCtx.fillRect(0, 0, signatureCanvas.width, signatureCanvas.height);
        }
        
        const rect = signatureCanvas.getBoundingClientRect();
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);
        
        [lastX, lastY] = [
            clientX - rect.left, 
            clientY - rect.top
        ];
    }
    
    function draw(e) {
        if (!isDrawing) return;
        e.preventDefault();
        
        const rect = signatureCanvas.getBoundingClientRect();
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);
        
        const currentX = clientX - rect.left;
        const currentY = clientY - rect.top;
        
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
        initSignaturePad();
    });
    
    // Handle file upload for avatar
    avatarUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            fileNameDisplay.textContent = file.name;
            const reader = new FileReader();
            reader.onload = (event) => {
                avatarImage = event.target.result;
            };
            reader.readAsDataURL(file);
        } else {
            fileNameDisplay.textContent = 'No file chosen';
            avatarImage = null;
        }
    });
    
    // Custom file upload button
    fileUploadBtn.addEventListener('click', () => {
        avatarUpload.click();
    });
    
        // Reset form
    resetBtn.addEventListener('click', () => {
        document.getElementById('name').value = 'Takashi Yamada';
        document.getElementById('username').value = '3578112509950001';
        document.getElementById('playing').value = 'Jl. Merdeka No. 17, Jakarta';
        document.getElementById('maritalStatus').value = 'Single';
        document.getElementById('employmentStatus').value = 'Employed';
        document.getElementById('religion').value = 'Islam';
        document.getElementById('hobby').value = 'Photography';
        fileNameDisplay.textContent = 'No file chosen';
        avatarImage = null;
        initSignaturePad();
        
        // Create a pulse effect on the form
        const formSections = document.querySelectorAll('.form-section');
        formSections.forEach(section => {
            section.style.transform = 'scale(0.98)';
            section.style.boxShadow = '0 0 0 3px rgba(58, 123, 213, 0.3)';
            
            setTimeout(() => {
                section.style.transform = '';
                section.style.boxShadow = '';
            }, 300);
        });
    });
    
    // Generate profile card
    generateBtn.addEventListener('click', () => {
        try {
            // Show loading overlay
            showLoading();
            
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
            
            // Add a little delay to show the loading animation
            setTimeout(() => {
                cardGenerator.generateCard(profileData)
                    .then(() => {
                        // Hide loading overlay
                        hideLoading();
                        
                        // Show download button with animation
                        downloadBtn.style.display = 'flex';
                        downloadBtn.style.opacity = '0';
                        downloadBtn.style.transform = 'translateY(20px)';
                        
                        setTimeout(() => {
                            downloadBtn.style.opacity = '1';
                            downloadBtn.style.transform = 'translateY(0)';
                        }, 100);
                        
                        // Add card appearance animation
                        const cardPreview = document.querySelector('.card-preview');
                        cardPreview.style.transform = 'scale(0.95)';
                        cardPreview.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.3)';
                        
                        setTimeout(() => {
                            cardPreview.style.transform = 'scale(1)';
                            cardPreview.style.boxShadow = '';
                        }, 300);
                        
                        // Scroll to card
                        const cardContainer = document.querySelector('.card-container');
                        cardContainer.scrollIntoView({ behavior: 'smooth' });
                    })
                    .catch(error => {
                        console.error('Error generating card:', error);
                        hideLoading();
                        alert('There was an issue generating the ID card, but we\'ve created a basic version for you.');
                        downloadBtn.style.display = 'flex';
                    });
            }, 1000); // 1 second delay to show the loading animation
            
        } catch (error) {
            console.error('Error preparing card data:', error);
            hideLoading();
            alert('Something went wrong. Please try again.');
        }
    });
    
    // Handle download button
    downloadBtn.addEventListener('click', () => {
        try {
            // Add downloading animation
            downloadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Downloading...';
            downloadBtn.disabled = true;
            
            setTimeout(() => {
                const canvas = document.getElementById('profileCanvas');
                const link = document.createElement('a');
                link.download = 'my-id-card.png';
                link.href = canvas.toDataURL('image/png');
                link.click();
                
                // Reset button
                downloadBtn.innerHTML = '<i class="fas fa-download"></i> Download ID Card';
                downloadBtn.disabled = false;
            }, 800);
        } catch (error) {
            console.error('Error downloading card:', error);
            alert('Failed to download. Try right-clicking on the image and selecting "Save Image As".');
            
            // Reset button
            downloadBtn.innerHTML = '<i class="fas fa-download"></i> Download ID Card';
            downloadBtn.disabled = false;
        }
    });
    
    // Generate default card on load
    showLoading();
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
            setTimeout(() => {
                hideLoading();
                downloadBtn.style.display = 'flex';
                
                // Add welcome animation
                const container = document.querySelector('.container');
                container.style.animation = 'fadeIn 0.5s ease-out';
            }, 800);
        })
        .catch(error => {
            console.error('Error in initial card generation:', error);
            hideLoading();
            // Still show the download button
            downloadBtn.style.display = 'flex';
        });
        
    // Add some fun animations to the page
    document.querySelectorAll('.form-section').forEach(section => {
        section.addEventListener('mouseenter', () => {
            section.style.transform = 'translateY(-5px)';
            section.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.15)';
        });
        
        section.addEventListener('mouseleave', () => {
            section.style.transform = '';
            section.style.boxShadow = '0 3px 10px rgba(0, 0, 0, 0.1)';
        });
    });
});
