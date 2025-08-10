// Wait for the page to fully load before running the script
        document.addEventListener('DOMContentLoaded', () => {
            // 1. GETTING ELEMENTS FROM THE PAGE
            
            // These lines get references to HTML elements we'll work with
            const timerDisplay = document.getElementById('timer');
            const hoursInput = document.getElementById('hours');
            const minutesInput = document.getElementById('minutes');
            const secondsInput = document.getElementById('seconds');
            const startBtn = document.getElementById('startBtn');
            const stopBtn = document.getElementById('stopBtn');
            const resetBtn = document.getElementById('resetBtn');
            const lapBtn = document.getElementById('lapBtn');
            const lapsList = document.getElementById('laps');
            
            // 2. VARIABLES TO TRACK TIMER STATE
           
            // countdown: Stores the interval ID so we can stop it later
            // totalSeconds: The remaining time in seconds
            // isRunning: Flag to check if timer is currently running
            // lapCount: Counter for lap numbers
            let countdown;
            let totalSeconds = 0;
            let isRunning = false;
            let lapCount = 1;
            
            // 3. FORMAT TIME FUNCTION
           
            // Converts seconds to HH:MM:SS format
            function formatTime(seconds) {
                // Calculate hours, minutes, seconds
                const hrs = Math.floor(seconds / 3600);
                const mins = Math.floor((seconds % 3600) / 60);
                const secs = seconds % 60;
                
                // Format each part to 2 digits with leading zeros
                return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
            }
            
            // 4. UPDATE DISPLAY FUNCTION
           
            // Updates the timer display with current time
            function updateDisplay() {
                timerDisplay.textContent = formatTime(totalSeconds);
            }
            
            // 5. START TIMER FUNCTION
            
            function startTimer() {
                // Prevent starting if already running
                if (isRunning) return;
                
                // Get time values from inputs
                const hours = parseInt(hoursInput.value) || 0;
                const minutes = parseInt(minutesInput.value) || 0;
                const seconds = parseInt(secondsInput.value) || 0;
                
                // Calculate total seconds
                totalSeconds = hours * 3600 + minutes * 60 + seconds;
                
                // Validate time
                if (totalSeconds <= 0) {
                    alert('Please enter a valid time!');
                    return;
                }
                
                // Update state
                isRunning = true;
                startBtn.disabled = true; // Disable start button
                hoursInput.disabled = true; // Disable inputs
                minutesInput.disabled = true;
                secondsInput.disabled = true;
                
                // Update display immediately
                updateDisplay();
                
                // Start the countdown interval
                countdown = setInterval(() => {
                    totalSeconds--; // Decrease time by 1 second
                    updateDisplay(); // Update display
                    
                    // When timer reaches zero
                    if (totalSeconds <= 0) {
                        clearInterval(countdown); // Stop the interval
                        isRunning = false;
                        startBtn.disabled = false; // Re-enable start button
                        
                        // Visual effect - flash red
                        timerDisplay.style.color = '#ff5252';
                        timerDisplay.style.textShadow = '0 0 10px #ff5252';
                        
                        // Remove visual effect after 1 second
                        setTimeout(() => {
                            timerDisplay.style.color = 'white';
                            timerDisplay.style.textShadow = 'none';
                        }, 1000);
                    }
                }, 1000); // Run every 1000ms (1 second)
            }
            
            // 6. STOP TIMER FUNCTION
            
            function stopTimer() {
                // Only stop if running
                if (!isRunning) return;
                
                clearInterval(countdown); // Stop the interval
                isRunning = false;
                startBtn.disabled = false; // Re-enable start button
            }
            
            // 7. RESET TIMER FUNCTION
            
            function resetTimer() {
                // Stop timer if running
                stopTimer();
                
                // Reset time
                totalSeconds = 0;
                updateDisplay();
                
                // Enable inputs
                startBtn.disabled = false;
                hoursInput.disabled = false;
                minutesInput.disabled = false;
                secondsInput.disabled = false;
                
                // Reset visual style
                timerDisplay.style.color = 'white';
                timerDisplay.style.textShadow = 'none';
                
                // Reset lap counter and clear lap list
                lapCount = 1;
                lapsList.innerHTML = '';
            }
            
            // 8. RECORD LAP FUNCTION
            
            function recordLap() {
                // Only record if timer is running and has time left
                if (!isRunning || totalSeconds <= 0) return;
                
                // Create a new list item for the lap
                const lapItem = document.createElement('li');
                
                // Add lap number and formatted time
                lapItem.innerHTML = `
                    <span class="lap-number">Lap ${lapCount}</span>
                    <span>${formatTime(totalSeconds)}</span>
                `;
                
                // Animation setup
                lapItem.style.opacity = '0';
                lapItem.style.transform = 'translateY(-20px)';
                
                // Add to top of lap list
                lapsList.prepend(lapItem);
                
                // Animate in
                setTimeout(() => {
                    lapItem.style.transition = 'all 0.3s ease';
                    lapItem.style.opacity = '1';
                    lapItem.style.transform = 'translateY(0)';
                }, 10);
                
                lapCount++; // Increase lap counter
                
                // Scroll to top of laps list
                lapsList.parentElement.scrollTop = 0;
            }
            
            // 9. INPUT VALIDATION FUNCTION
            
            function validateInput(input, max) {
                input.addEventListener('change', () => {
                    // Get value or default to 0
                    let value = parseInt(input.value) || 0;
                    
                    // Ensure value is within range
                    if (value < 0) input.value = '0';
                    if (value > max) input.value = max.toString();
                });
            }
            
            // 10. SET UP EVENT LISTENERS
           
            // Button click handlers
            startBtn.addEventListener('click', startTimer);
            stopBtn.addEventListener('click', stopTimer);
            resetBtn.addEventListener('click', resetTimer);
            lapBtn.addEventListener('click', recordLap);
            
            // Input validation
            validateInput(hoursInput, 99);
            validateInput(minutesInput, 59);
            validateInput(secondsInput, 59);
            
            // 11. INITIALIZE THE DISPLAY
            
            updateDisplay();
        });