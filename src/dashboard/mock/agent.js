import Mock from 'mockjs';
import faker from 'faker';
import { paginator } from './_utils';

const agents = Mock.mock({
  'data|11': [{
    id () {
      return Mock.Random.guid()
    },
    name () {
      return faker.company.companyName();
    },
    created_at: '@datetime',
    ip () { return Mock.Random.ip() },
    capacity () { return Math.ceil(Math.random()*10) },
    node_capacity () { return Math.ceil(Math.random()*10) },
    status () { return Mock.Random.pick(['inactive', 'active']) },
    log_level () { return Mock.Random.pick(['info', 'debug']) },
    type () { return Mock.Random.pick(['docker', 'kubernetes']) },
    schedulable () { return Mock.Random.pick([true, false]) },
    organization_id () { return Mock.Random.guid() },
    image: '',
    config_file () { return Mock.Random.pick(['financial.zip', 'sales.zip', 'customer.zip', 'marketing.zip', 'network.zip']) },
  }],
});

function getAgents(req, res) {
  const { page = 1, per_page: perPage = 10 } = req.query;
  const result = paginator(agents.data, parseInt(page, 10), parseInt(perPage, 10));
  res.send({
    total: result.total,
    data: result.data,
  });
}

function createAgent(req, res) {
  const message = req.body;

  if (!message.capacity) {
    res.send({
      code: 20001,
      detail: 'capacity is required'
    });
  }

  if (!message.node_capacity) {
    res.send({
      code: 20001,
      detail: 'node_capacity is required'
    });
  }

  if (!message.type) {
    res.send({
      code: 20001,
      detail: 'type is required'
    });
  }

  if (!message.ip) {
    res.send({
      code: 20001,
      detail: 'ip is required'
    });
  }

  const id = Mock.Random.guid();

  agents.data.push({
    id,
    name: message.name,
    created_at: new Date(),
    ip: message.ip,
    capacity: message.capacity,
    node_capacity: message.node_capacity,
    status: 'active',
    log_level: message.capacity,
    type: message.type,
    schedulable: message.schedulable,
    organization_id: '',
    image: message.image,
    config_file () { return Mock.Random.pick(['financial.zip', 'sales.zip', 'customer.zip', 'marketing.zip', 'network.zip'])}
  });
  res.send({id});
}

export default {
  'GET /api/agents': getAgents,
  'POST /api/agents': createAgent,
};