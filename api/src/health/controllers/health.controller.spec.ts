import { Test } from '@nestjs/testing'
import { HealthController } from './health.controller'

describe('HealthController', () => {
  let healthController: HealthController

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [],
    }).compile()

    healthController = moduleRef.get<HealthController>(HealthController)
  })

  describe('getHealthCheck', () => {
    it('should perform a health check', async () => {
      expect(await healthController.getHealthCheck()).toBeTruthy()
    })
  })
})
