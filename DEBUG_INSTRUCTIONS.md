# Debug Fee Settings Sync Issue

## Step 1: Check localStorage in Browser

1. Open your browser DevTools (press F12)
2. Go to the "Console" tab
3. Type this command and press Enter:
   ```javascript
   console.log('School Type:', localStorage.getItem('schoolType'));
   console.log('Payment Channels:', localStorage.getItem('enabledPaymentChannels'));
   console.log('Fee Categories:', localStorage.getItem('enabledFeeCategories'));
   ```

4. Take a screenshot of the output

## Step 2: Test the Event System

1. Stay in the Console tab
2. Add this listener:
   ```javascript
   window.addEventListener('schoolTypeChanged', (e) => {
     console.log('Event received!', e.detail);
   });
   ```

3. Go to Settings → Fee Configuration
4. Change the school type dropdown
5. Check the console - you should see "Event received!" with the new school type

## Step 3: Manual Test

If the event isn't firing, run this in console:
```javascript
// Manually set school type
localStorage.setItem('schoolType', 'tertiary');

// Manually trigger event
window.dispatchEvent(new CustomEvent('schoolTypeChanged', {
  detail: { schoolType: 'tertiary' }
}));

// Reload the page
location.reload();
```

Then go to Students → Any student → Fees tab and check if it says "Tertiary Institution"

## Expected Results:

**For Tertiary Institution:**
- Blue banner should say: "School Type: Tertiary Institution"
- Category dropdown should have: Tuition, Admission, Infrastructure, Academic Services, Examination, Sports, **Hostel & Accommodation**, **Departmental Fees**, **Convocation & Graduation**, **Transcript & Documents**, Miscellaneous
- Should NOT have: Transportation, PTA Fees, Meals, Boarding, Government Levies

## Share Results

Please share:
1. What localStorage shows (Step 1)
2. Whether the event fires (Step 2)
3. What the blue banner shows after manual test (Step 3)
