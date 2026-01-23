-- Cleanup legacy items from previous schema

-- Drop legacy functions
DROP FUNCTION IF EXISTS public.check_and_increment_rate_limit(text, text, integer, integer);
DROP FUNCTION IF EXISTS public.cleanup_expired_story_images();
DROP FUNCTION IF EXISTS public.cleanup_old_rate_limits();

-- Drop legacy table and its policies
DROP POLICY IF EXISTS "Service role full access" ON public.rate_limits;
DROP TABLE IF EXISTS public.rate_limits;
