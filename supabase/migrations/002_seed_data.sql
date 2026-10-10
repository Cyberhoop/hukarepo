-- ====================================================================
-- SHISHA RENT - SEED DATA FOR SHARED SUPABASE POSTGRESQL DATABASE
-- Exact approved 49 products with zero duplicates + payment settings
-- ====================================================================

-- 1. SEED DEFAULT PAYMENT SETTINGS
INSERT INTO public.payment_settings (
  id,
  upi_id,
  payee_name,
  qr_image_url,
  qr_storage_path,
  is_active,
  cod_enabled,
  instructions,
  updated_at,
  updated_by
) VALUES (
  'active_config',
  'shisharent@upi',
  'Shisha Rent Kolkata',
  '',
  '',
  true,
  true,
  'Scan with GPay, PhonePe, Paytm, or BHIM. Send transaction screenshot on WhatsApp for instant confirmation.',
  NOW(),
  'system_initialization'
) ON CONFLICT (id) DO UPDATE SET
  upi_id = EXCLUDED.upi_id,
  payee_name = EXCLUDED.payee_name;

-- 2. SEED APPROVED PRODUCTS (49 Items - Exact Spellings - Zero Duplicates)
INSERT INTO public.products (id, name, category, category_label, type, description, rental_or_sale, in_stock, display_order)
VALUES
-- FLAVOUR BRANDS / VARIETIES (15 Brands)
('flavour-al-fakir', 'Al Fakir', 'flavours', 'Flavour Brands / Varieties', 'Flavour Brand', 'Renowned classic shisha flavour known for authentic notes, smooth buzz, and rich smoke clouds.', 'Available on Request', true, 1),
('flavour-al-fuse', 'Al Fuse', 'flavours', 'Flavour Brands / Varieties', 'Flavour Brand', 'Vibrant modern blend crafted for refreshing fusion mixes and long-lasting session sessions.', 'Available on Request', true, 2),
('flavour-aladdin', 'Aladdin', 'flavours', 'Flavour Brands / Varieties', 'Flavour Brand', 'Exotic Middle-Eastern herbal shisha recipe featuring sweet citrus and chilled mint tones.', 'Available on Request', true, 3),
('flavour-afreen', 'Afreen', 'flavours', 'Flavour Brands / Varieties', 'Flavour Brand', 'Signature rich flavour with deep aromatic notes, consistent heat tolerance, and premium leaf cut.', 'Available on Request', true, 4),
('flavour-al-fazila', 'Al Fazila', 'flavours', 'Flavour Brands / Varieties', 'Flavour Brand', 'Traditional aromatic blend delivering dense velvet smoke and balanced sweetness.', 'Available on Request', true, 5),
('flavour-afzal', 'Afzal', 'flavours', 'Flavour Brands / Varieties', 'Flavour Brand', 'World-famous paan, mint, and fruity blends loved for signature Indian shisha perfection.', 'Available on Request', true, 6),
('flavour-aroma', 'Aroma', 'flavours', 'Flavour Brands / Varieties', 'Flavour Brand', 'Fragrant boutique blend designed for smooth aftertastes and refreshing room ambiance.', 'Available on Request', true, 7),
('flavour-royal', 'Royal', 'flavours', 'Flavour Brands / Varieties', 'Flavour Brand', 'High-grade luxury tobacco & molasses blend offering full-bodied flavor from first pull to last.', 'Available on Request', true, 8),
('flavour-ayaan', 'Ayaan', 'flavours', 'Flavour Brands / Varieties', 'Flavour Brand', 'Crisp and fruit-forward shisha molasses, perfect for festive parties and mixed bowls.', 'Available on Request', true, 9),
('flavour-keva', 'Keva', 'flavours', 'Flavour Brands / Varieties', 'Flavour Brand', 'Delicate floral and berry profile with gentle cooling sensations for relaxed evenings.', 'Available on Request', true, 10),
('flavour-makai', 'Makai', 'flavours', 'Flavour Brands / Varieties', 'Flavour Brand', 'Distinctive sweet exotic blend curated for hookah connoisseurs seeking rare aromas.', 'Available on Request', true, 11),
('flavour-maya', 'Maya', 'flavours', 'Flavour Brands / Varieties', 'Flavour Brand', 'Premium molasses cut engineered for effortless heat management and zero harshness.', 'Available on Request', true, 12),
('flavour-exotic', 'Exotic', 'flavours', 'Flavour Brands / Varieties', 'Flavour Brand', 'Tropical punch and passion fruit combination creating thick, aromatic white clouds.', 'Available on Request', true, 13),
('flavour-harval', 'Harval', 'flavours', 'Flavour Brands / Varieties', 'Flavour Brand', '100% tobacco-free herbal shisha base formulated with organic tea leaves and sugarcane molasses.', 'Available on Request', true, 14),
('flavour-al-akbar', 'Al Akbar', 'flavours', 'Flavour Brands / Varieties', 'Flavour Brand', 'Rich royal blend inspired by heritage spices and dark berry undertones.', 'Available on Request', true, 15),

-- HOOKAH & BASE OPTIONS (9 Items)
('hookah-standard', 'Hookah', 'hookah-bases', 'Hookah & Base Options', 'Hookah Model', 'Classic high-grade hookah apparatus equipped with stainless steel stem and balanced downstem.', 'Available for Rental & Setup', true, 16),
('hookah-maya', 'Maya Hookah', 'hookah-bases', 'Hookah & Base Options', 'Hookah Model', 'Designer crystal glass and anodized aluminum hookah engineered for ultra-smooth draw.', 'Available for Rental & Setup', true, 17),
('hookah-coco-aaya', 'Coco Aaya Hookah', 'hookah-bases', 'Hookah & Base Options', 'Hookah Model', 'Heavyweight modern masterpiece with diffuser technology and high-stability footprint.', 'Available for Rental & Setup', true, 18),
('hookah-afreen', 'Afreen Hookah', 'hookah-bases', 'Hookah & Base Options', 'Hookah Model', 'Opulent brass and carved detailing hookah, ideal for weddings and VIP private gatherings.', 'Available for Rental & Setup', true, 19),
('base-maya', 'Maya Hookah Base', 'hookah-bases', 'Hookah & Base Options', 'Base Vessel', 'Extra thick bohemian glass base engineered for Maya series with watertight seal.', 'Available on Request', true, 20),
('base-coco-aaya', 'Coco Aaya Hookah Base', 'hookah-bases', 'Hookah & Base Options', 'Base Vessel', 'Wide conical glass vase providing rock-solid stability and maximum smoke cooling chamber.', 'Available on Request', true, 21),
('base-afreen', 'Afreen Hookah Base', 'hookah-bases', 'Hookah & Base Options', 'Base Vessel', 'Intricately patterned artisan glass base with ruby red and gold leaf accents.', 'Available on Request', true, 22),
('hookah-stand', 'Hookah Stand', 'hookah-bases', 'Hookah & Base Options', 'Hardware / Stand', 'Anti-tilt protective metal stand that prevents accidental knocks during lively parties.', 'Available on Request', true, 23),
('hookah-pot', 'Hookah Pot', 'hookah-bases', 'Hookah & Base Options', 'Component', 'Standard replacement water chamber pot with reinforced glass walls.', 'Available on Request', true, 24),

-- CHILAM OPTIONS (3 Items)
('chilam-silicone', 'Silicone Chilam', 'chilam', 'Chilam Options', 'Chilam Bowl', 'Unbreakable food-grade silicone bowl compatible with Lotus heat management devices.', 'Available on Request', true, 25),
('chilam-mud', 'Mud / Mitti Chilam', 'chilam', 'Chilam Options', 'Chilam Bowl', 'Authentic porous clay bowl delivering the quintessential traditional Indian shisha taste.', 'Available on Request', true, 26),
('chilam-rubber', 'Chilam Rubber', 'chilam', 'Chilam Options', 'Grommet / Seal', 'Heat-resistant silicone grommet for an airtight seal between stem and chilam bowl.', 'Consumable & Accessory', true, 27),

-- HOOKAH PIPE OPTIONS (6 Items)
('pipe-maya', 'Maya Hookah Pipe', 'pipes', 'Hookah Pipe Options', 'Hose & Handle', 'Ergonomic soft-touch silicone hose with matte aluminum wand tailored for Maya hookahs.', 'Available on Request', true, 28),
('pipe-afreen', 'Afreen Hookah Pipe', 'pipes', 'Hookah Pipe Options', 'Hose & Handle', 'Traditional woven braided hose with elongated regal wooden handle and velvet sleeve.', 'Available on Request', true, 29),
('pipe-coco-aaya', 'Coco Aaya Hookah Pipe', 'pipes', 'Hookah Pipe Options', 'Hose & Handle', 'Wide-bore silicone hose designed for effortless unrestricted airflow and rapid cleaning.', 'Available on Request', true, 30),
('pipe-disposable', 'Disposable Pipe', 'pipes', 'Hookah Pipe Options', 'Hose & Handle', 'Individually wrapped single-use plastic hose for 100% hygienic party events.', 'Consumable & Accessory', true, 31),
('pipe-silicone', 'Silicone Pipe', 'pipes', 'Hookah Pipe Options', 'Hose & Handle', 'Medical-grade washable silicone hose that never retains ghost flavours or odors.', 'Available on Request', true, 32),
('pipe-rubber', 'Pipe Rubber', 'pipes', 'Hookah Pipe Options', 'Grommet / Seal', 'Flexible tapered seal ensuring airtight hose adapter connection.', 'Consumable & Accessory', true, 33),

-- HEATING, COAL & ACCESSORIES (9 Items)
('acc-heater-burner', 'Heater Burner', 'coal-accessories', 'Heating, Coal & Accessories', 'Heating Device', 'Electric spiral coil burner for fast, uniform ignition of coconut coals in 5 minutes.', 'Available on Request', true, 34),
('acc-big-filter', 'Big Filter', 'coal-accessories', 'Heating, Coal & Accessories', 'Diffuser / Filter', 'Downstem noise-reducing filter for whisper-quiet pull and micro-bubble filtration.', 'Available on Request', true, 35),
('acc-charcoal', 'Charcoal', 'coal-accessories', 'Heating, Coal & Accessories', 'Fuel / Coal', 'High-density hard wood charcoal providing steady warmth without chemical odors.', 'Consumable & Accessory', true, 36),
('acc-coconut-coal', 'Coconut Coal', 'coal-accessories', 'Heating, Coal & Accessories', 'Fuel / Coal', '100% natural compressed coconut shell cubes with low ash, 90+ minutes burn time.', 'Consumable & Accessory', true, 37),
('acc-magic-coal', 'Magic Coal', 'coal-accessories', 'Heating, Coal & Accessories', 'Fuel / Coal', 'Quick-lighting circular coal disks ready in seconds with standard lighter flame.', 'Consumable & Accessory', true, 38),
('acc-tong', 'Tong', 'coal-accessories', 'Heating, Coal & Accessories', 'Tool', 'Stainless steel serrated tongs for safe gripping, rotating and ash-tapping.', 'Consumable & Accessory', true, 39),
('acc-pot-rubber', 'Pot Rubber', 'coal-accessories', 'Heating, Coal & Accessories', 'Grommet / Seal', 'Heavy duty rubber gasket for locking base pot to stem securely.', 'Consumable & Accessory', true, 40),
('acc-stand-rubber', 'Stand Rubber', 'coal-accessories', 'Heating, Coal & Accessories', 'Grommet / Seal', 'Anti-slip rubber feet padding for metal hookah stands.', 'Consumable & Accessory', true, 41),
('acc-hookah-base-rubber', 'Hookah Base Rubber', 'coal-accessories', 'Heating, Coal & Accessories', 'Grommet / Seal', 'Precision base seal engineered to prevent leaks and stabilize tall hookahs.', 'Consumable & Accessory', true, 42),

-- SR PRODUCTS / RANGE (7 Items)
('sr-hookah', 'SR Hookah', 'sr-products', 'SR Products / Range', 'Signature Collection', 'Flagship Shisha Rent luxury hookah custom-built for high-end events and lounges.', 'Available for Rental & Setup', true, 43),
('sr-shisha', 'SR Shisha', 'sr-products', 'SR Products / Range', 'Signature Collection', 'Curated complete shisha package including specialized stem, base, and airflow valve.', 'Available for Rental & Setup', true, 44),
('sr-herbal', 'SR Herbal', 'sr-products', 'SR Products / Range', 'Signature Collection', 'Proprietary non-tobacco herbal molasses collection with natural fruit extracts.', 'Available on Request', true, 45),
('sr-regular', 'SR Regular', 'sr-products', 'SR Products / Range', 'Signature Collection', 'Everyday crowd-pleaser setup delivering reliable smooth sessions at optimal value.', 'Available on Request', true, 46),
('sr-special', 'SR Special', 'sr-products', 'SR Products / Range', 'Signature Collection', 'Enhanced setup with dual-hose support, ice tip chamber, and custom fruit bowl prep.', 'Available for Rental & Setup', true, 47),
('sr-premium', 'SR Premium', 'sr-products', 'SR Products / Range', 'Signature Collection', 'VIP grade gold-trimmed hookah setup with full accessory kit and dedicated coals.', 'Available for Rental & Setup', true, 48),
('sr-basics', 'SR Basics', 'sr-products', 'SR Products / Range', 'Signature Collection', 'Compact and convenient essential starter kit for home chill sessions and quick setups.', 'Available on Request', true, 49)

ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  description = EXCLUDED.description,
  rental_or_sale = EXCLUDED.rental_or_sale;
