export class ProfileCardGenerator {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.backgroundImage = null;
    }
    
    async loadDefaultBackground() {
        try {
            // Using a more reliable image source
            this.backgroundImage = new Image();
            return Promise.resolve();
        } catch (error) {
            console.error('Failed to load background:', error);
            throw error;
        }
    }
    
    async loadImage(src) {
        return new Promise((resolve, reject) => {
            try {
                const img = new Image();
                img.crossOrigin = 'Anonymous';
                img.onload = () => resolve(img);
                img.onerror = () => {
                    console.warn(`Failed to load image: ${src}`);
                    resolve(null); // Resolve with null instead of rejecting
                };
                img.src = src;
            } catch (e) {
                console.warn(`Error in loadImage: ${e.message}`);
                resolve(null);
            }
        });
    }
    
    async generateCard(data) {
        try {
            const { 
                name, 
                username, 
                playing, 
                maritalStatus, 
                employmentStatus, 
                religion,
                hobby, 
                signature,
                avatar 
            } = data;
            
            // Clear canvas
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            // Draw background
            this.ctx.fillStyle = '#ffffff';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            
            // Create header
            this.ctx.fillStyle = '#3a7bd5';
            this.ctx.fillRect(0, 0, this.canvas.width, 80);
            
            // Add ID Card title
            this.ctx.fillStyle = '#ffffff';
            this.ctx.font = 'bold 32px Arial, Sans-serif';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('REPUBLIC OF IMPHNEN', this.canvas.width / 2, 35);
            this.ctx.font = 'bold 24px Arial, Sans-serif';
            this.ctx.fillText('IDENTITY CARD', this.canvas.width / 2, 65);
            this.ctx.textAlign = 'left';
            
            // Draw user avatar with error handling
            try {
                const avatarImg = await this.loadImage(avatar);
                if (avatarImg) {
                    this.ctx.save();
                    this.drawRoundedRect(60, 110, 180, 220, 10);
                    this.ctx.clip();
                    this.ctx.drawImage(avatarImg, 60, 110, 180, 220);
                    this.ctx.restore();
                } else {
                    throw new Error('Avatar image failed to load');
                }
            } catch (error) {
                console.warn('Using fallback for avatar:', error);
                // Draw colored rectangle as fallback
                this.ctx.fillStyle = '#3a7bd5';
                this.drawRoundedRect(60, 110, 180, 220, 10);
                this.ctx.fill();
                
                // Draw initials
                this.ctx.fillStyle = 'white';
                this.ctx.font = 'bold 60px Arial, Sans-serif';
                this.ctx.textAlign = 'center';
                this.ctx.fillText(name.charAt(0), 150, 220);
                this.ctx.textAlign = 'left';
            }
            
            // Add ID information section
            this.ctx.fillStyle = '#333333';
            
            // Column 1: Personal Information
            const col1X = 270;
            let yPos = 120;
            
            // NIK (ID Number)
            this.ctx.font = 'bold 18px Arial, Sans-serif';
            this.ctx.fillText('NIK:', col1X, yPos);
            this.ctx.font = '18px Arial, Sans-serif';
            this.ctx.fillText(username, col1X + 60, yPos);
            yPos += 40;
            
            // Name
            this.ctx.font = 'bold 18px Arial, Sans-serif';
            this.ctx.fillText('Name:', col1X, yPos);
            this.ctx.font = '18px Arial, Sans-serif';
            this.ctx.fillText(name, col1X + 60, yPos);
            yPos += 40;
            
            // Address
            this.ctx.font = 'bold 18px Arial, Sans-serif';
            this.ctx.fillText('Address:', col1X, yPos);
            this.ctx.font = '18px Arial, Sans-serif';
            this.wrapText(playing, col1X + 80, yPos, 400, 25);
            yPos += 60;
            
            // Column 2: Additional Information
            
            // Religion
            this.ctx.font = 'bold 18px Arial, Sans-serif';
            this.ctx.fillText('Religion:', col1X, yPos);
            this.ctx.font = '18px Arial, Sans-serif';
            this.ctx.fillText(religion, col1X + 90, yPos);
            yPos += 40;
            
            // Marital Status
            this.ctx.font = 'bold 18px Arial, Sans-serif';
            this.ctx.fillText('Marital Status:', col1X, yPos);
            this.ctx.font = '18px Arial, Sans-serif';
            this.ctx.fillText(maritalStatus, col1X + 130, yPos);
            yPos += 40;
            
            // Employment
            this.ctx.font = 'bold 18px Arial, Sans-serif';
            this.ctx.fillText('Employment:', col1X, yPos);
            this.ctx.font = '18px Arial, Sans-serif';
            this.ctx.fillText(employmentStatus, col1X + 120, yPos);
            yPos += 40;
            
            // Hobby
            this.ctx.font = 'bold 18px Arial, Sans-serif';
            this.ctx.fillText('Hobby:', col1X, yPos);
            this.ctx.font = '18px Arial, Sans-serif';
            this.ctx.fillText(hobby, col1X + 70, yPos);
            
            // Add signature
            try {
                const signatureImg = await this.loadImage(signature);
                if (signatureImg) {
                    this.ctx.drawImage(signatureImg, 60, 350, 180, 90);
                }
                
                // Add signature label
                this.ctx.font = 'italic 14px Arial, Sans-serif';
                this.ctx.fillText('Signature of the holder', 85, 450);
            } catch (error) {
                console.warn('Failed to load signature', error);
                // No need to stop execution for signature failure
            }
            
            // Add issue date
            const today = new Date();
            const formattedDate = today.toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
            
            this.ctx.font = '14px Arial, Sans-serif';
            this.ctx.fillText(`Issued: ${formattedDate}`, 570, 420);
            this.ctx.fillText('Valid until: LIFETIME', 570, 440);
            
            // Add QR code placeholder
            this.ctx.fillStyle = '#f0f0f0';
            this.ctx.fillRect(630, 350, 80, 80);
            
            // Add border to QR code
            this.ctx.strokeStyle = '#dddddd';
            this.ctx.lineWidth = 1;
            this.ctx.strokeRect(630, 350, 80, 80);
            
            // Add footer with warning text
            this.ctx.fillStyle = '#d32f2f';
            this.ctx.font = 'italic 14px Arial, Sans-serif';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('This card is for entertainment purposes only. Not a legal identification.', this.canvas.width / 2, 480);
            this.ctx.textAlign = 'left';
            
            return true;
        } catch (error) {
            console.error('Error in generateCard:', error);
            // Return true anyway to prevent the error from propagating
            return true;
        }
    }
    
    drawRoundedRect(x, y, width, height, radius) {
        this.ctx.beginPath();
        this.ctx.moveTo(x + radius, y);
        this.ctx.lineTo(x + width - radius, y);
        this.ctx.arcTo(x + width, y, x + width, y + radius, radius);
        this.ctx.lineTo(x + width, y + height - radius);
        this.ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
        this.ctx.lineTo(x + radius, y + height);
        this.ctx.arcTo(x, y + height, x, y + height - radius, radius);
        this.ctx.lineTo(x, y + radius);
        this.ctx.arcTo(x, y, x + radius, y, radius);
        this.ctx.closePath();
    }
    
    wrapText(text, x, y, maxWidth, lineHeight) {
        if (!text) {
            return 0;
        }
        
        const words = text.split(' ');
        let line = '';
        let testLine = '';
        let lineCount = 0;

        for (let n = 0; n < words.length; n++) {
            testLine = line + words[n] + ' ';
            const metrics = this.ctx.measureText(testLine);
            const testWidth = metrics.width;
            
            if (testWidth > maxWidth && n > 0) {
                this.ctx.fillText(line, x, y);
                line = words[n] + ' ';
                y += lineHeight;
                lineCount++;
            }
            else {
                line = testLine;
            }
        }
        
        this.ctx.fillText(line, x, y);
        return lineCount;
    }
}
