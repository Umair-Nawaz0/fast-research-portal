import asyncio
import os
import glob
import subprocess
import shutil
from pathlib import Path
from playwright.async_api import async_playwright

BASE_DIR = Path(__file__).resolve().parent.parent.parent
OUTPUT_DIR = BASE_DIR / "demo_output"
OUTPUT_DIR.mkdir(exist_ok=True)


async def record_demonstration():
    print("Starting automated demonstration recording...")

    # Clean previous webm files
    for f in OUTPUT_DIR.glob("*.webm"):
        try:
            f.unlink()
        except Exception:
            pass

    async with async_playwright() as p:
        browser = await p.chromium.launch(
            headless=True,
            args=[
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-dev-shm-usage",
                "--disable-gpu",
            ],
        )

        context = await browser.new_context(
            viewport={"width": 1280, "height": 720},
            record_video_dir=str(OUTPUT_DIR),
            record_video_size={"width": 1280, "height": 720},
        )

        page = await context.new_page()

        try:
            # Step 1: Title & Server Health Screen (~4s)
            intro_path = f"file://{BASE_DIR}/backend/scripts/html/intro.html"
            print("1. Displaying Intro Title Card & Server Status...")
            await page.goto(intro_path)
            await page.wait_for_timeout(4000)

            # Step 2: Live Frontend Dashboard (~4s)
            print("2. Opening Live Frontend Portal...")
            await page.goto("http://localhost:3000", wait_until="networkidle")
            await page.wait_for_timeout(2000)

            # Scroll to view cards and metrics
            await page.evaluate("window.scrollTo({ top: 350, behavior: 'smooth' })")
            await page.wait_for_timeout(2000)

            # Step 3: Switch to Table View and back (~4s)
            print("3. Demonstrating Table & Grid View Toggle...")
            table_btn = page.locator('button[title="Data Table View"]')
            if await table_btn.count() > 0:
                await table_btn.click()
                await page.wait_for_timeout(2500)

            grid_btn = page.locator('button[title="Cards Grid View"]')
            if await grid_btn.count() > 0:
                await grid_btn.click()
                await page.wait_for_timeout(1500)

            # Step 4: Open Create Opportunity Modal (~2s)
            print("4. Opening Create Opportunity Modal...")
            await page.evaluate("window.scrollTo({ top: 0, behavior: 'smooth' })")
            await page.wait_for_timeout(500)

            post_btn = page.locator('button:has-text("Post Faculty Opportunity")').first
            await post_btn.click()
            await page.wait_for_timeout(1500)

            # Step 5: Demonstrate Form Validation Error (~2.5s)
            print("5. Demonstrating Validation Error (Required Fields)...")
            title_input = page.locator('input[placeholder*="Software-Defined Networking"]').first
            await title_input.fill("")
            submit_btn = page.locator('button:has-text("Post Opportunity")').last
            await submit_btn.click()
            await page.wait_for_timeout(2500)

            # Step 6: Fill Valid Opportunity Details (~4s)
            print("6. Filling and Submitting Valid Research Opportunity...")
            await title_input.fill("Software-Defined Networking (SDN) Flow Routing")

            faculty_input = page.locator('input[placeholder*="Dr. Tariq Mahmood"]').first
            await faculty_input.fill("Dr. Tariq Mahmood")

            email_input = page.locator('input[placeholder="faculty@nu.edu.pk"]').first
            await email_input.fill("tariq.mahmood@nu.edu.pk")

            desc_input = page.locator('textarea').first
            await desc_input.fill(
                "Investigating intelligent routing policies using OpenFlow controllers for congestion reduction in multi-tenant data centers."
            )

            skill_input = page.locator('input[placeholder*="Type skill"]').first
            await skill_input.fill("Python")
            await page.locator('button:has-text("Add")').first.click()

            pos_input = page.locator('input[type="number"]').first
            await pos_input.fill("3")

            deadline_input = page.locator('input[type="date"]').first
            await deadline_input.fill("2026-11-30")

            await page.wait_for_timeout(1000)
            await submit_btn.click()
            print("Submitted successfully!")
            await page.wait_for_timeout(3000)

            # Step 7: View Details Modal (~3s)
            print("7. Viewing Complete Opportunity Details Modal...")
            view_details_btn = page.locator('button:has-text("View Details")').first
            if await view_details_btn.count() > 0:
                await view_details_btn.click()
                await page.wait_for_timeout(3000)
                await page.keyboard.press("Escape")
                await page.wait_for_timeout(1000)

            # Step 8: Edit Opportunity (~3s)
            print("8. Editing Opportunity (Updating positions)...")
            edit_btn = page.locator('button[title="Edit Opportunity"]').first
            if await edit_btn.count() > 0:
                await edit_btn.click()
                await page.wait_for_timeout(1500)
                pos_edit = page.locator('input[type="number"]').first
                await pos_edit.fill("4")
                save_btn = page.locator('button:has-text("Save Changes")').first
                await save_btn.click()
                await page.wait_for_timeout(2500)

            # Step 9: Close Opportunity (~3s)
            print("9. Closing Opportunity (Status Toggle)...")
            close_btn = page.locator('button[title="Close Opportunity"]').first
            if await close_btn.count() > 0:
                await close_btn.click()
                await page.wait_for_timeout(2500)

            # Step 10: Delete Opportunity (~3s)
            print("10. Deleting Opportunity with Confirmation...")
            delete_btn = page.locator('button[title="Delete Opportunity"]').first
            if await delete_btn.count() > 0:
                await delete_btn.click()
                await page.wait_for_timeout(1500)
                confirm_del_btn = page.locator('button:has-text("Delete Listing")').last
                if await confirm_del_btn.count() > 0:
                    await confirm_del_btn.click()
                await page.wait_for_timeout(2500)

            # Step 11: Postman Scenarios & 404 Error (~7s)
            print("11. Demonstrating Postman Test Suite & 404 Not Found...")
            postman_path = f"file://{BASE_DIR}/backend/scripts/html/postman.html"
            await page.goto(postman_path)
            await page.wait_for_timeout(7000)

            # Step 12: Outro Summary Screen (~4s)
            print("12. Displaying Outro Summary...")
            outro_path = f"file://{BASE_DIR}/backend/scripts/html/outro.html"
            await page.goto(outro_path)
            await page.wait_for_timeout(4000)

        finally:
            print("Closing browser context and finalizing video...")
            await context.close()
            await browser.close()


def process_video():
    webm_files = list(OUTPUT_DIR.glob("*.webm"))
    if not webm_files:
        print("No webm video found in output directory!")
        return

    latest_webm = max(webm_files, key=os.path.getctime)
    mp4_target = BASE_DIR / "demonstration_video.mp4"
    downloads_target = Path("/home/umair/Downloads/BCS-5C_Assignment01_Umair_Nawaz.mp4")

    print(f"Converting {latest_webm} to MP4...")
    cmd = [
        "ffmpeg",
        "-y",
        "-i", str(latest_webm),
        "-c:v", "libx264",
        "-preset", "medium",
        "-crf", "22",
        "-pix_fmt", "yuv420p",
        "-r", "30",
        str(mp4_target),
    ]
    subprocess.run(cmd, check=True)

    # Copy to Downloads
    subprocess.run(["cp", str(mp4_target), str(downloads_target)], check=True)

    # Get duration using ffprobe
    duration_cmd = [
        "ffprobe",
        "-v", "error",
        "-show_entries", "format=duration",
        "-of", "default=noprint_wrappers=1:nokey=1",
        str(mp4_target),
    ]
    duration = subprocess.check_output(duration_cmd).decode().strip()
    print(f"\nSUCCESS! Video generated:")
    print(f"- Repository copy: {mp4_target}")
    print(f"- Downloads copy:  {downloads_target}")
    print(f"- Duration:        {float(duration):.1f} seconds (Per requirement: <= 1 minute)")


if __name__ == "__main__":
    asyncio.run(record_demonstration())
    process_video()
