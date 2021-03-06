'use strict';

const should = require('should');
const ServiceRegistry = require('../../server/serviceRegistry');
const config = require('../../config');
const log = config.log('test');

describe('ServiceRegistry', () => {
    describe('new', () => {
        it('should accept a timeout being passed in', (done) => {
            const serviceRegistry = new ServiceRegistry(42, log);
            serviceRegistry._timeout.should.equal(42);
            done();
        });
    });

    describe('add / get', () => {
        it('should add a new intent to the registry and provide it via get', (done) => {
            const serviceRegistry = new ServiceRegistry(30, log)
            serviceRegistry.add('test', '127.0.0.1', 9999, 'someToken');
            const testIntent = serviceRegistry.get('test');
            testIntent.intent.should.equal('test');
            testIntent.ip.should.equal('127.0.0.1');
            testIntent.port.should.equal(9999);
            done();
        });

        it('should update a service', (done) => {
            const serviceRegistry = new ServiceRegistry(30, log)
            serviceRegistry.add('test', '127.0.0.1', 9999, 'someToken');
            const testIntent1 = serviceRegistry.get('test');
            
            serviceRegistry.add('test', '127.0.0.1', 9999, 'someToken');
            const testIntent2 = serviceRegistry.get('test');

            Object.keys(serviceRegistry._services).length.should.equal(1);
            testIntent2.timestamp.should.be.greaterThanOrEqual(testIntent1.timestamp);
            done();
        });
    });

    describe('remove', () => {
        it('should remove a service from the registry', (done) => {
            const serviceRegistry = new ServiceRegistry(30, log)
            serviceRegistry.add('test', '127.0.0.1', 9999, 'someToken');
            serviceRegistry.remove('test', '127.0.0.1', 9999, 'someToken');
            const testIntent = serviceRegistry.get('test');
            should.not.exist(testIntent);
            done();
        });
    });

    describe('cleanup', () => {
        it('should remove expired services from the registry', () => {
            const serviceRegistry = new ServiceRegistry(-1, log)
            serviceRegistry.add('test', '127.0.0.1', 9999, 'someToken');
            const testIntent = serviceRegistry.get('test');
            should.not.exist(testIntent);
        });
    })
});