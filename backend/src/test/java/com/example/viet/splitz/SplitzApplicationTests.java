package com.example.viet.splitz;

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE)
@ActiveProfiles("test")
@Disabled("Re-enable after test security wiring is in place")
class SplitzApplicationTests {

	@Test
	void contextLoads() {}
}
