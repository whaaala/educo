# How to Fix the 404 Error

The 404 error is caused by a corrupted .next build cache. Follow these steps:

## Steps to Fix:

1. **Stop the development server**
   - Go to your terminal where `npm run dev` is running
   - Press `Ctrl + C` to stop it

2. **Delete the .next folder**
   ```bash
   # On Windows (PowerShell or Command Prompt)
   rmdir /s /q .next

   # Or manually delete the .next folder from your project root
   ```

3. **Restart the development server**
   ```bash
   npm run dev
   ```

4. **Access the application**
   - Open your browser to `http://localhost:3000`
   - Navigate to Students page
   - Click on any student to see the Fees tab

## What to Test After Restart:

### 1. Fee Configuration in Settings (`/settings`)
- Scroll to "Fee Configuration" section
- Change school type (Private/Public/Tertiary)
- Enable/disable payment channels
- Enable/disable fee categories
- Settings should persist when you refresh

### 2. Student Fees Tab
- Go to Students page
- Click on any student
- Go to "Fees" tab
- Check that:
  - Currency symbol matches your selected country (₦ for Nigeria, $ for US, etc.)
  - Fee categories show correctly
  - All amounts display with the correct currency
  - Filter dropdown shows categories for the school type

### 3. Currency Changes
- Go to Settings
- Change country (e.g., from Nigeria to USA)
- Go back to Student Fees
- Currency should update automatically (from ₦ to $)

## Files Modified:
- `components/students/FeesManagement.tsx` - Updated with currency support
- `components/settings/FeeSettings.tsx` - New fee configuration component
- `app/settings/page.tsx` - Added fee settings section
- `lib/feeConfigNew.ts` - Comprehensive fee configuration
- `app/students/[id]/page.tsx` - Updated to pass schoolType prop
